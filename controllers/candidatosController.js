const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

// Obtener todos los candidatos con información de sus partidos
const getAllCandidatos = async (req, res) => {
    try {
        const [candidatos] = await pool.query(`
            SELECT 
                c.*,
                p.nombre AS partido_nombre,
                p.logo_url AS partido_logo
            FROM candidatos c
            LEFT JOIN partidos p ON c.partido_id = p.partido_id
        `);
        res.json(candidatos);
    } catch (error) {
        console.error('Error al obtener candidatos:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener un candidato por ID
const getCandidatoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [candidatos] = await pool.query('SELECT * FROM candidatos WHERE candidato_id = ?', [id]);
        
        if (candidatos.length === 0) {
            return res.status(404).json({ message: "Candidato no encontrado" });
        }
        
        res.json(candidatos[0]);
    } catch (error) {
        console.error('Error al obtener el candidato:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Crear un nuevo candidato
const createCandidato = async (req, res) => {
    try {
        const { nombre, apellido, biografia, lugar_nacimiento, partido_id, plan_gobierno_completo } = req.body;

        // Construir la URL de la foto si se subió un archivo
        let foto_url = null;
        if (req.file) {
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const randomDigits = Math.floor(1000 + Math.random() * 9000);
            const newFilename = `candidato-${timestamp}-${randomDigits}${path.extname(req.file.originalname)}`;
            const newPath = path.join(__dirname, "..", "public", "uploads", "images", newFilename);
            fs.renameSync(req.file.path, newPath);
            foto_url = `/uploads/images/${newFilename}`;
        }

        const [result] = await pool.query(
            'INSERT INTO candidatos (nombre, apellido, foto_url, biografia, lugar_nacimiento, partido_id, esta_activo, plan_gobierno_completo) VALUES (?, ?, ?, ?, ?, ?, 1, ?)',            [nombre, apellido, foto_url, biografia, lugar_nacimiento, partido_id, plan_gobierno_completo]
        );

        const [nuevoCandidato] = await pool.query('SELECT * FROM candidatos WHERE candidato_id = ?', [result.insertId]);
        res.status(201).json(nuevoCandidato[0]);
    } catch (error) {
        console.error('Error al crear el candidato:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Actualizar un candidato existente
const updateCandidato = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, biografia, lugar_nacimiento, partido_id, esta_activo, plan_gobierno_completo } = req.body;
        
        // Si hay un nuevo archivo, procesar la foto
        let foto_url;
        if (req.file) {
            // Obtener la foto anterior para eliminarla
            const [candidatoAnterior] = await pool.query('SELECT foto_url FROM candidatos WHERE candidato_id = ?', [id]);
            if (candidatoAnterior.length > 0 && candidatoAnterior[0].foto_url) {
                const rutaAnterior = path.join(__dirname, '..', 'public', candidatoAnterior[0].foto_url);
                if (fs.existsSync(rutaAnterior)) {
                    fs.unlinkSync(rutaAnterior);
                }
            }
            
            // Establecer la nueva URL de la foto
            foto_url = `/uploads/images/${req.file.filename}`;
        }
        
        // Construir la consulta SQL dinámicamente
        let sql = 'UPDATE candidatos SET nombre = ?, apellido = ?, biografia = ?, lugar_nacimiento = ?, partido_id = ?, esta_activo = ?, plan_gobierno_completo = ?';
        let params = [nombre, apellido, biografia, lugar_nacimiento, partido_id, parseInt(esta_activo), plan_gobierno_completo];
        
        if (req.file) {
            sql += ', foto_url = ?';
            params.push(foto_url);
        }
        
        sql += ' WHERE candidato_id = ?';
        params.push(id);
        
        const [result] = await pool.query(sql, params);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Candidato no encontrado" });
        }
        
        res.json({ message: "Candidato actualizado exitosamente" });
    } catch (error) {
        console.error('Error al actualizar el candidato:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Eliminar un candidato (eliminación física)
const deleteCandidato = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener información de la foto para eliminarla
        const [candidato] = await pool.query('SELECT foto_url FROM candidatos WHERE candidato_id = ?', [id]);
        if (candidato.length > 0 && candidato[0].foto_url) {
            const rutaFoto = path.join(__dirname, '..', 'public', candidato[0].foto_url);
            if (fs.existsSync(rutaFoto)) {
                fs.unlinkSync(rutaFoto);
            }
        }

        const [result] = await pool.query('DELETE FROM candidatos WHERE candidato_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Candidato no encontrado" });
        }

        res.json({ message: "Candidato eliminado exitosamente" });
    } catch (error) {
        console.error('Error al eliminar el candidato:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = {
    getAllCandidatos,
    getCandidatoById,
    createCandidato,
    updateCandidato,
    deleteCandidato
};