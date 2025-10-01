const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

// Obtener todos los partidos
const getAllPartidos = async (req, res) => {
    try {
        const [partidos] = await pool.query('SELECT * FROM partidos ORDER BY nombre ASC');
        res.json(partidos);
    } catch (error) {
        console.error('Error al obtener partidos:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener un partido por ID
const getPartidoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [partidos] = await pool.query('SELECT * FROM partidos WHERE partido_id = ?', [id]);
        
        if (partidos.length === 0) {
            return res.status(404).json({ message: "Partido no encontrado" });
        }
        
        res.json(partidos[0]);
    } catch (error) {
        console.error('Error al obtener el partido:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Crear un nuevo partido
const createPartido = async (req, res) => {
    try {
        const { nombre } = req.body;

        // Construir la URL del logo si se subió un archivo
        let logo_url = null;
        if (req.file) {
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const randomDigits = Math.floor(1000 + Math.random() * 9000);
            const newFilename = `partido-${timestamp}-${randomDigits}${path.extname(req.file.originalname)}`;
            const newPath = path.join(__dirname, "..", "public", "uploads", "images", newFilename);
            fs.renameSync(req.file.path, newPath);
            logo_url = `/uploads/images/${newFilename}`;
        }

        const [result] = await pool.query(
            'INSERT INTO partidos (nombre, logo_url) VALUES (?, ?)',
            [nombre, logo_url]
        );

        const [nuevoPartido] = await pool.query('SELECT * FROM partidos WHERE partido_id = ?', [result.insertId]);
        res.status(201).json(nuevoPartido[0]);
    } catch (error) {
        console.error('Error al crear el partido:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Ya existe un partido con ese nombre" });
        }
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Actualizar un partido existente
const updatePartido = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        
        // Si hay un nuevo archivo, procesar el logo
        let logo_url;
        if (req.file) {
            // Obtener el logo anterior para eliminarlo
            const [partidoAnterior] = await pool.query('SELECT logo_url FROM partidos WHERE partido_id = ?', [id]);
            if (partidoAnterior.length > 0 && partidoAnterior[0].logo_url) {
                const rutaAnterior = path.join(__dirname, '..', 'public', partidoAnterior[0].logo_url);
                if (fs.existsSync(rutaAnterior)) {
                    fs.unlinkSync(rutaAnterior);
                }
            }
            
            // Establecer la nueva URL del logo
            logo_url = `/uploads/images/${req.file.filename}`;
        }
        
        // Construir la consulta SQL dinámicamente
        let sql = 'UPDATE partidos SET nombre = ?';
        let params = [nombre];
        
        if (req.file) {
            sql += ', logo_url = ?';
            params.push(logo_url);
        }
        
        sql += ' WHERE partido_id = ?';
        params.push(id);
        
        const [result] = await pool.query(sql, params);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Partido no encontrado" });
        }
        
        res.json({ message: "Partido actualizado exitosamente" });
    } catch (error) {
        console.error('Error al actualizar el partido:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Ya existe un partido con ese nombre" });
        }
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Eliminar un partido
const deletePartido = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener información del logo para eliminarlo
        const [partido] = await pool.query('SELECT logo_url FROM partidos WHERE partido_id = ?', [id]);
        if (partido.length > 0 && partido[0].logo_url) {
            const rutaLogo = path.join(__dirname, '..', 'public', partido[0].logo_url);
            if (fs.existsSync(rutaLogo)) {
                fs.unlinkSync(rutaLogo);
            }
        }

        const [result] = await pool.query('DELETE FROM partidos WHERE partido_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Partido no encontrado" });
        }

        res.json({ message: "Partido eliminado exitosamente" });
    } catch (error) {
        console.error('Error al eliminar el partido:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = {
    getAllPartidos,
    getPartidoById,
    createPartido,
    updatePartido,
    deletePartido
};