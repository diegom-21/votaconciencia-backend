const db = require('../config/database');
const { generarResumenIA } = require('../services/openaiService');

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

        if (!candidato || !candidato.plan_gobierno_completo) {
            return res.status(404).json({ error: 'El candidato no tiene un plan de gobierno cargado.' });
        }

        // Paso B: Obtener el nombre del tema
        const [[tema]] = await db.query(
            'SELECT nombre_tema FROM temas WHERE tema_id = ?',
            [tema_id]
        );

        if (!tema) {
            return res.status(404).json({ error: 'Tema no encontrado' });
        }

        console.log('Candidato encontrado:', candidato);
        console.log('Tema encontrado:', tema);
        console.log('Generando resumen con OpenAI...');

        // Paso C: Generar el resumen con OpenAI
        const resumen_ia = await generarResumenIA(candidato.plan_gobierno_completo, tema.nombre_tema);

        // Paso D: Insertar la propuesta en la base de datos
        await db.query(
            'INSERT INTO propuestas (candidato_id, tema_id, titulo_propuesta, resumen_ia) VALUES (?, ?, ?, ?)',
            [candidato_id, tema_id, titulo_propuesta, resumen_ia]
        );

        res.status(201).json({ message: 'Propuesta creada exitosamente' });
    } catch (error) {
        console.error('Error al crear la propuesta:', error);
        res.status(500).json({ error: 'Error al crear la propuesta' });
    }
};

// Actualizar una propuesta existente
exports.updatePropuesta = async (req, res) => {
    const { id } = req.params;
    const { titulo_propuesta, resumen_ia } = req.body;

    try {
        // Construir la consulta dinámicamente según los campos enviados
        const fields = [];
        const values = [];

        if (titulo_propuesta) {
            fields.push('titulo_propuesta = ?');
            values.push(titulo_propuesta);
        }

        if (resumen_ia) {
            fields.push('resumen_ia = ?');
            values.push(resumen_ia);
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
        }

        values.push(id); // Agregar el ID al final para la cláusula WHERE

        const [result] = await db.query(
            `UPDATE propuestas SET ${fields.join(', ')} WHERE propuesta_id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Propuesta no encontrada' });
        }

        res.json({ message: 'Propuesta actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar la propuesta:', error);
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
