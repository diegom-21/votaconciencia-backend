const pool = require('../config/database');

// Obtener todos los temas
const getAllTemas = async (req, res) => {
    try {
        const [temas] = await pool.query('SELECT * FROM temas ORDER BY nombre_tema');
        res.json(temas);
    } catch (error) {
        console.error('Error al obtener temas:', error);
        res.status(500).json({ message: 'Error al obtener los temas' });
    }
};

// Crear un nuevo tema
const createTema = async (req, res) => {
    const { nombre_tema, icono_url } = req.body;

    try {
        // Verificar si el tema ya existe
        const [existingTemas] = await pool.query(
            'SELECT * FROM temas WHERE nombre_tema = ?',
            [nombre_tema]
        );

        if (existingTemas.length > 0) {
            return res.status(400).json({ message: 'Ya existe un tema con este nombre' });
        }

        // Insertar el nuevo tema
        const [result] = await pool.query(
            'INSERT INTO temas (nombre_tema, icono_url) VALUES (?, ?)',
            [nombre_tema, icono_url]
        );

        res.status(201).json({
            tema_id: result.insertId,
            nombre_tema,
            icono_url
        });
    } catch (error) {
        console.error('Error al crear tema:', error);
        res.status(500).json({ message: 'Error al crear el tema' });
    }
};

// Actualizar un tema existente
const updateTema = async (req, res) => {
    const { tema_id } = req.params;
    const { nombre_tema, icono_url } = req.body;

    try {
        // Verificar si el tema existe
        const [existingTema] = await pool.query(
            'SELECT * FROM temas WHERE tema_id = ?',
            [tema_id]
        );

        if (existingTema.length === 0) {
            return res.status(404).json({ message: 'Tema no encontrado' });
        }

        // Verificar si el nuevo nombre ya existe (excluyendo el tema actual)
        const [existingNombre] = await pool.query(
            'SELECT * FROM temas WHERE nombre_tema = ? AND tema_id != ?',
            [nombre_tema, tema_id]
        );

        if (existingNombre.length > 0) {
            return res.status(400).json({ message: 'Ya existe un tema con este nombre' });
        }

        // Actualizar el tema
        await pool.query(
            'UPDATE temas SET nombre_tema = ?, icono_url = ? WHERE tema_id = ?',
            [nombre_tema, icono_url, tema_id]
        );

        res.json({
            tema_id: parseInt(tema_id),
            nombre_tema,
            icono_url
        });
    } catch (error) {
        console.error('Error al actualizar tema:', error);
        res.status(500).json({ message: 'Error al actualizar el tema' });
    }
};

// Eliminar un tema
const deleteTema = async (req, res) => {
    const { tema_id } = req.params;

    try {
        // Verificar si hay propuestas asociadas al tema
        const [propuestas] = await pool.query(
            'SELECT * FROM propuestas WHERE tema_id = ?',
            [tema_id]
        );

        if (propuestas.length > 0) {
            return res.status(400).json({
                message: 'No se puede eliminar el tema porque tiene propuestas asociadas'
            });
        }

        // Eliminar el tema
        const [result] = await pool.query(
            'DELETE FROM temas WHERE tema_id = ?',
            [tema_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tema no encontrado' });
        }

        res.json({ message: 'Tema eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar tema:', error);
        res.status(500).json({ message: 'Error al eliminar el tema' });
    }
};

module.exports = {
    getAllTemas,
    createTema,
    updateTema,
    deleteTema
};