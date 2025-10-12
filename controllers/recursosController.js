const recursosService = require('../services/recursosService');
const fs = require('fs').promises;
const path = require('path');

exports.getAllRecursos = async (req, res) => {
    try {
        const recursos = await recursosService.getAllRecursos();
        res.json(recursos);
    } catch (error) {
        console.error('Error al obtener recursos:', error);
        res.status(500).json({ error: 'Error al obtener los recursos educativos' });
    }
};

exports.getRecursoById = async (req, res) => {
    try {
        const recurso = await recursosService.getRecursoById(req.params.id);
        if (!recurso) {
            return res.status(404).json({ error: 'Recurso no encontrado' });
        }
        res.json(recurso);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el recurso' });
    }
};

exports.createRecurso = async (req, res) => {
    try {
        const { titulo, contenido_html, esta_publicado } = req.body;
        const imagen_url = req.file ? `/uploads/images/${req.file.filename}` : null;

        const recurso = await recursosService.createRecurso({
            titulo,
            contenido_html,
            imagen_url,
            esta_publicado: esta_publicado === 'true' || esta_publicado === true
        });

        res.status(201).json(recurso);
    } catch (error) {
        console.error('Error al crear recurso:', error);
        if (req.file) {
            await fs.unlink(req.file.path).catch(console.error);
        }
        res.status(500).json({ error: 'Error al crear el recurso educativo' });
    }
};

exports.updateRecurso = async (req, res) => {
    try {
        const { titulo, contenido_html, esta_publicado } = req.body;
        const imagen_url = req.file ? `/uploads/images/${req.file.filename}` : undefined;

        const recursoActual = await recursosService.getRecursoById(req.params.id);
        if (!recursoActual) {
            return res.status(404).json({ error: 'Recurso no encontrado' });
        }

        const recurso = await recursosService.updateRecurso(req.params.id, {
            titulo,
            contenido_html,
            imagen_url,
            esta_publicado: esta_publicado === 'true' || esta_publicado === true
        });

        // Si hay una nueva imagen y existía una imagen anterior, eliminar la anterior
        if (imagen_url && recursoActual.imagen_url) {
            const oldImagePath = path.join(__dirname, '..', 'public', recursoActual.imagen_url);
            await fs.unlink(oldImagePath).catch(console.error);
        }

        res.json(recurso);
    } catch (error) {
        console.error('Error al actualizar recurso:', error);
        if (req.file) {
            await fs.unlink(req.file.path).catch(console.error);
        }
        res.status(500).json({ error: 'Error al actualizar el recurso educativo' });
    }
};

exports.deleteRecurso = async (req, res) => {
    try {
        const recurso = await recursosService.getRecursoById(req.params.id);
        if (!recurso) {
            return res.status(404).json({ error: 'Recurso no encontrado' });
        }

        await recursosService.deleteRecurso(req.params.id);

        // Eliminar imagen si existe
        if (recurso.imagen_url) {
            const imagePath = path.join(__dirname, '..', 'public', recurso.imagen_url);
            await fs.unlink(imagePath).catch(console.error);
        }

        res.json({ message: 'Recurso eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el recurso' });
    }
};