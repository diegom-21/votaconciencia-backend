const pool = require('../config/database');

// Obtener el historial político de un candidato específico
const getHistorialByCandidatoId = async (req, res) => {
    try {
        const { candidatoId } = req.params;
        const [historial] = await pool.query(
            'SELECT * FROM historial_politico WHERE candidato_id = ? ORDER BY ano_inicio DESC',
            [candidatoId]
        );
        res.json(historial);
    } catch (error) {
        console.error('Error al obtener historial político:', error);
        res.status(500).json({ message: 'Error al obtener el historial político' });
    }
};

// Crear una nueva entrada en el historial
const addHistorialEntry = async (req, res) => {
    try {
        const { candidato_id, cargo, institucion, ano_inicio, ano_fin } = req.body;

        // Validaciones básicas
        if (!candidato_id || !cargo || !ano_inicio) {
            return res.status(400).json({ 
                message: 'Los campos candidato_id, cargo y año de inicio son obligatorios' 
            });
        }

        // Verificar que el candidato existe
        const [candidato] = await pool.query(
            'SELECT * FROM candidatos WHERE candidato_id = ?',
            [candidato_id]
        );

        if (candidato.length === 0) {
            return res.status(404).json({ message: 'Candidato no encontrado' });
        }

        // Preparar valores para la inserción
        const institucionValue = institucion || null; // Si no se manda, guardar como NULL
        const anoFinValue = ano_fin || null; // Si no se manda, guardar como NULL

        // Insertar la nueva entrada
        const [result] = await pool.query(
            'INSERT INTO historial_politico (candidato_id, cargo, institucion, ano_inicio, ano_fin) VALUES (?, ?, ?, ?, ?)',
            [candidato_id, cargo, institucionValue, ano_inicio, anoFinValue]
        );

        res.status(201).json({
            historial_id: result.insertId,
            candidato_id,
            cargo,
            institucion: institucionValue,
            ano_inicio,
            ano_fin: anoFinValue
        });
    } catch (error) {
        console.error('Error al crear entrada de historial:', error);
        res.status(500).json({ message: 'Error al crear la entrada del historial' });
    }
};

// Actualizar una entrada del historial
const updateHistorialEntry = async (req, res) => {
    try {
        const { historialId } = req.params;
        const { cargo, institucion, ano_inicio, ano_fin } = req.body;

        // Validaciones básicas
        if (!cargo || !institucion || !ano_inicio) {
            return res.status(400).json({ 
                message: 'Los campos cargo, institución y año de inicio son obligatorios' 
            });
        }

        // Verificar que la entrada existe
        const [existingEntry] = await pool.query(
            'SELECT * FROM historial_politico WHERE historial_id = ?',
            [historialId]
        );

        if (existingEntry.length === 0) {
            return res.status(404).json({ message: 'Entrada de historial no encontrada' });
        }

        // Actualizar la entrada
        await pool.query(
            'UPDATE historial_politico SET cargo = ?, institucion = ?, ano_inicio = ?, ano_fin = ? WHERE historial_id = ?',
            [cargo, institucion, ano_inicio, ano_fin, historialId]
        );

        res.json({
            historial_id: parseInt(historialId),
            cargo,
            institucion,
            ano_inicio,
            ano_fin
        });
    } catch (error) {
        console.error('Error al actualizar entrada de historial:', error);
        res.status(500).json({ message: 'Error al actualizar la entrada del historial' });
    }
};

// Eliminar una entrada del historial
const deleteHistorialEntry = async (req, res) => {
    try {
        const { historialId } = req.params;

        // Verificar que la entrada existe
        const [existingEntry] = await pool.query(
            'SELECT * FROM historial_politico WHERE historial_id = ?',
            [historialId]
        );

        if (existingEntry.length === 0) {
            return res.status(404).json({ message: 'Entrada de historial no encontrada' });
        }

        // Eliminar la entrada
        await pool.query(
            'DELETE FROM historial_politico WHERE historial_id = ?',
            [historialId]
        );

        res.json({ message: 'Entrada de historial eliminada con éxito' });
    } catch (error) {
        console.error('Error al eliminar entrada de historial:', error);
        res.status(500).json({ message: 'Error al eliminar la entrada del historial' });
    }
};

module.exports = {
    getHistorialByCandidatoId,
    addHistorialEntry,
    updateHistorialEntry,
    deleteHistorialEntry
};