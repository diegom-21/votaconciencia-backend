const db = require('../config/database');
const openai = require('../config/openai');

// Obtener todas las propuestas con datos enriquecidos
exports.getAllPropuestas = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.propuesta_id, p.titulo_propuesta, p.resumen_ia, 
                   c.nombre AS nombre_candidato, t.nombre_tema
            FROM propuestas p
            JOIN candidatos c ON p.candidato_id = c.candidato_id
            JOIN temas t ON p.tema_id = t.tema_id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las propuestas' });
    }
};

// Crear una nueva propuesta con generación de resumen por IA
exports.createPropuesta = async (req, res) => {
    const { candidato_id, tema_id, titulo_propuesta } = req.body;

    try {
        // Paso A: Obtener el plan de gobierno completo del candidato
        const [[candidato]] = await db.query(
            'SELECT plan_gobierno_completo FROM candidatos WHERE candidato_id = ?',
            [candidato_id]
        );

        if (!candidato) {
            return res.status(404).json({ error: 'Candidato no encontrado' });
        }

        // Paso B: Obtener el nombre del tema
        const [[tema]] = await db.query(
            'SELECT nombre_tema FROM temas WHERE tema_id = ?',
            [tema_id]
        );

        if (!tema) {
            return res.status(404).json({ error: 'Tema no encontrado' });
        }

        // Paso C: Construir el prompt para OpenAI
        const prompt = `Del siguiente plan de gobierno: ${candidato.plan_gobierno_completo}. Eres un analista político neutral. Genera un resumen conciso (máximo 150 palabras) sobre las propuestas específicas relacionadas con el tema de '${tema.nombre_tema}'. El título de la propuesta es '${titulo_propuesta}'.`;

        // Paso D: Llamar a la API de OpenAI
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt,
            max_tokens: 150
        });

        const resumen_ia = response.data.choices[0].text.trim();

        // Paso E: Insertar la propuesta en la base de datos
        await db.query(
            'INSERT INTO propuestas (candidato_id, tema_id, titulo_propuesta, resumen_ia) VALUES (?, ?, ?, ?)',
            [candidato_id, tema_id, titulo_propuesta, resumen_ia]
        );

        res.status(201).json({ message: 'Propuesta creada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la propuesta' });
    }
};

// Actualizar una propuesta existente
exports.updatePropuesta = async (req, res) => {
    const { id } = req.params;
    const { titulo_propuesta, resumen_ia } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE propuestas SET titulo_propuesta = ?, resumen_ia = ? WHERE propuesta_id = ?',
            [titulo_propuesta, resumen_ia, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Propuesta no encontrada' });
        }

        res.json({ message: 'Propuesta actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la propuesta' });
    }
};

// Eliminar una propuesta
exports.deletePropuesta = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM propuestas WHERE propuesta_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Propuesta no encontrada' });
        }

        res.json({ message: 'Propuesta eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la propuesta' });
    }
};
