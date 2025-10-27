const { generarResumenIA } = require('../services/openaiService');
const pool = require('../config/database');

/**
 * Controlador simple para consultas de IA sobre candidatos
 * Sin cache en base de datos, solo respuestas directas
 */

/**
 * Consultar a la IA sobre un candidato específico
 * POST /api/openai/consultar
 * Body: { candidatoId, pregunta }
 */
const consultarIA = async (req, res) => {
    try {
        const { candidatoId, pregunta } = req.body;

        // Validar datos de entrada
        if (!candidatoId || !pregunta) {
            return res.status(400).json({
                error: 'candidatoId y pregunta son requeridos'
            });
        }

        if (pregunta.trim().length === 0) {
            return res.status(400).json({
                error: 'La pregunta no puede estar vacía'
            });
        }

        if (pregunta.length > 500) {
            return res.status(400).json({
                error: 'La pregunta no puede exceder 500 caracteres'
            });
        }

        console.log('🤖 Consulta IA recibida:', { candidatoId, pregunta: pregunta.substring(0, 100) + '...' });

        // Obtener información del candidato y sus propuestas
        const candidatoQuery = `
            SELECT c.*, p.nombre as partido_nombre 
            FROM candidatos c 
            LEFT JOIN partidos p ON c.partido_id = p.partido_id 
            WHERE c.candidato_id = ?
        `;
        
        const propuestasQuery = `
            SELECT pr.*, t.nombre_tema 
            FROM propuestas pr 
            LEFT JOIN temas t ON pr.tema_id = t.tema_id 
            WHERE pr.candidato_id = ?
        `;

        const [candidatoResult] = await pool.execute(candidatoQuery, [candidatoId]);
        const [propuestasResult] = await pool.execute(propuestasQuery, [candidatoId]);

        if (candidatoResult.length === 0) {
            return res.status(404).json({
                error: 'Candidato no encontrado'
            });
        }

        const candidato = candidatoResult[0];
        const propuestas = propuestasResult;

        // Construir contexto para la IA
        let contexto = `Información del candidato ${candidato.nombre} ${candidato.apellido} del partido ${candidato.partido_nombre || 'Independiente'}:\n\n`;
        
        if (candidato.biografia) {
            contexto += `Biografía: ${candidato.biografia}\n\n`;
        }

        if (propuestas.length > 0) {
            contexto += `Propuestas por tema:\n`;
            propuestas.forEach(propuesta => {
                contexto += `\n- ${propuesta.nombre_tema || 'Sin tema'}: ${propuesta.titulo_propuesta}\n`;
                if (propuesta.contenido_propuesta) {
                    contexto += `  Detalle: ${propuesta.contenido_propuesta}\n`;
                }
                if (propuesta.resumen_ia) {
                    contexto += `  Resumen: ${propuesta.resumen_ia}\n`;
                }
            });
        } else {
            contexto += `\nEste candidato aún no ha registrado propuestas específicas.`;
        }

        // Preparar prompt para la IA
        const promptCompleto = `${contexto}\n\nPregunta del ciudadano: ${pregunta}\n\nResponde de manera clara, directa y útil basándote únicamente en la información proporcionada del candidato. Si no tienes información suficiente para responder, indícalo claramente.`;

        console.log('📝 Enviando consulta a OpenAI...');
        
        // Generar respuesta usando el servicio existente (adaptándolo)
        const respuestaIA = await generarRespuestaIA(promptCompleto);

        console.log('✅ Respuesta de IA generada exitosamente');

        res.json({
            respuesta: respuestaIA,
            candidato: {
                id: candidato.candidato_id,
                nombre: candidato.nombre,
                apellido: candidato.apellido,
                partido: candidato.partido_nombre
            }
        });

    } catch (error) {
        console.error('❌ Error en consultarIA:', error);
        
        if (error.message.includes('OpenAI')) {
            return res.status(503).json({
                error: 'Servicio de IA temporalmente no disponible. Intenta más tarde.'
            });
        }

        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

/**
 * Función auxiliar para generar respuesta de IA adaptada para consultas
 */
const generarRespuestaIA = async (prompt) => {
    const OpenAI = require("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Eres un asistente de información política para VotaConCiencia. Tu trabajo es responder preguntas sobre candidatos presidenciales basándote únicamente en la información oficial proporcionada.

Reglas importantes:
- Responde en un tono amigable y profesional
- Usa máximo 150 palabras
- Si no tienes información suficiente, dilo claramente
- No inventes datos o información que no esté en el contexto
- Evita sesgo político
- Enfócate en ser útil para el ciudadano votante`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 200,
            temperature: 0.7
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error al generar respuesta con OpenAI:", error);
        throw new Error("No se pudo generar la respuesta con OpenAI.");
    }
};

module.exports = {
    consultarIA
};