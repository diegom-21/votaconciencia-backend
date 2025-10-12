const triviasService = require('../services/triviasService');
const fs = require('fs').promises;
const path = require('path');

// Controladores para Temas
exports.getAllTemas = async (req, res) => {
    try {
        const temas = await triviasService.getAllTemas();
        res.json(temas);
    } catch (error) {
        console.error('Error al obtener temas:', error);
        res.status(500).json({ error: 'Error al obtener los temas de trivia' });
    }
};

exports.getTemaById = async (req, res) => {
    try {
        const tema = await triviasService.getTemaById(req.params.id);
        if (!tema) {
            return res.status(404).json({ error: 'Tema no encontrado' });
        }
        res.json(tema);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el tema' });
    }
};

exports.createTema = async (req, res) => {
    try {
        const { nombre_tema, descripcion, esta_activo } = req.body;
        const imagen_url = req.file ? `/uploads/images/${req.file.filename}` : null;

        const tema = await triviasService.createTema({
            nombre_tema,
            descripcion,
            imagen_url,
            esta_activo: esta_activo === 'true' || esta_activo === true
        });

        res.status(201).json(tema);
    } catch (error) {
        console.error('Error al crear tema:', error);
        if (req.file) {
            await fs.unlink(req.file.path).catch(console.error);
        }
        res.status(500).json({ error: 'Error al crear el tema de trivia' });
    }
};

exports.updateTema = async (req, res) => {
    try {
        const { nombre_tema, descripcion, esta_activo } = req.body;
        const imagen_url = req.file ? `/uploads/images/${req.file.filename}` : undefined;

        const temaActual = await triviasService.getTemaById(req.params.id);
        if (!temaActual) {
            return res.status(404).json({ error: 'Tema no encontrado' });
        }

        const tema = await triviasService.updateTema(req.params.id, {
            nombre_tema,
            descripcion,
            imagen_url,
            esta_activo: esta_activo === 'true' || esta_activo === true
        });

        // Si hay una nueva imagen y existía una imagen anterior, eliminar la anterior
        if (imagen_url && temaActual.imagen_url) {
            const oldImagePath = path.join(__dirname, '..', 'public', temaActual.imagen_url);
            await fs.unlink(oldImagePath).catch(console.error);
        }

        res.json(tema);
    } catch (error) {
        console.error('Error al actualizar tema:', error);
        if (req.file) {
            await fs.unlink(req.file.path).catch(console.error);
        }
        res.status(500).json({ error: 'Error al actualizar el tema de trivia' });
    }
};

exports.deleteTema = async (req, res) => {
    try {
        const tema = await triviasService.getTemaById(req.params.id);
        if (!tema) {
            return res.status(404).json({ error: 'Tema no encontrado' });
        }

        await triviasService.deleteTema(req.params.id);

        // Eliminar imagen si existe
        if (tema.imagen_url) {
            const imagePath = path.join(__dirname, '..', 'public', tema.imagen_url);
            await fs.unlink(imagePath).catch(console.error);
        }

        res.json({ message: 'Tema eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el tema' });
    }
};

// Controladores para Preguntas
exports.getPreguntasByTema = async (req, res) => {
    try {
        const preguntas = await triviasService.getPreguntasByTema(req.params.temaId);
        res.json(preguntas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las preguntas' });
    }
};

exports.createPregunta = async (req, res) => {
    try {
        const pregunta = await triviasService.createPregunta(req.body);
        res.status(201).json(pregunta);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la pregunta' });
    }
};

exports.updatePregunta = async (req, res) => {
    try {
        const pregunta = await triviasService.updatePregunta(req.params.id, req.body);
        if (!pregunta) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }
        res.json(pregunta);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la pregunta' });
    }
};

exports.deletePregunta = async (req, res) => {
    try {
        await triviasService.deletePregunta(req.params.id);
        res.json({ message: 'Pregunta eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la pregunta' });
    }
};

// Controladores para Opciones
exports.getOpcionesByPregunta = async (req, res) => {
    try {
        const opciones = await triviasService.getOpcionesByPregunta(req.params.preguntaId);
        res.json(opciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las opciones' });
    }
};

exports.createOpcion = async (req, res) => {
    try {
        const opcion = await triviasService.createOpcion(req.body);
        res.status(201).json(opcion);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la opción' });
    }
};

exports.updateOpcion = async (req, res) => {
    try {
        const opcion = await triviasService.updateOpcion(req.params.id, req.body);
        if (!opcion) {
            return res.status(404).json({ error: 'Opción no encontrada' });
        }
        res.json(opcion);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la opción' });
    }
};

exports.deleteOpcion = async (req, res) => {
    try {
        await triviasService.deleteOpcion(req.params.id);
        res.json({ message: 'Opción eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la opción' });
    }
};
