const cronogramaService = require('../services/cronogramaService');

exports.getAllEventos = async (req, res) => {
    try {
        const eventos = await cronogramaService.getAllEventos();
        res.json({ success: true, data: eventos });
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        res.status(500).json({ success: false, message: 'Error al obtener los eventos' });
    }
};

// Obtener eventos ordenados por proximidad a la fecha actual
exports.getEventosOrdenados = async (req, res) => {
    try {
        const eventos = await cronogramaService.getEventosOrdenados();
        res.json({ success: true, data: eventos });
    } catch (error) {
        console.error('Error al obtener los eventos ordenados:', error);
        res.status(500).json({ success: false, message: 'Error al obtener los eventos ordenados' });
    }
};

// Obtener el próximo evento más cercano
exports.getProximoEvento = async (req, res) => {
    try {
        const evento = await cronogramaService.getProximoEvento();
        if (!evento) {
            return res.status(404).json({ success: false, message: 'No hay eventos disponibles' });
        }
        res.json({ success: true, data: evento });
    } catch (error) {
        console.error('Error al obtener el próximo evento:', error);
        res.status(500).json({ success: false, message: 'Error al obtener el próximo evento' });
    }
};

exports.getEventoById = async (req, res) => {
    const { id } = req.params;
    try {
        const evento = await cronogramaService.getEventoById(id);
        if (!evento) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' });
        }
        res.json({ success: true, data: evento });
    } catch (error) {
        console.error('Error al obtener el evento:', error);
        res.status(500).json({ success: false, message: 'Error al obtener el evento' });
    }
};

exports.createEvento = async (req, res) => {
    const { titulo_evento, fecha_evento, descripcion, tipo_evento, esta_publicado } = req.body;
    try {
        const nuevoEvento = await cronogramaService.createEvento({ 
            titulo_evento, 
            fecha_evento, 
            descripcion, 
            tipo_evento, 
            esta_publicado: esta_publicado === 'true' || esta_publicado === true 
        });
        res.status(201).json({ success: true, data: nuevoEvento });
    } catch (error) {
        console.error('Error al crear el evento:', error);
        res.status(500).json({ success: false, message: 'Error al crear el evento' });
    }
};

exports.updateEvento = async (req, res) => {
    const { id } = req.params;
    const { titulo_evento, fecha_evento, descripcion, tipo_evento, esta_publicado } = req.body;
    try {
        const eventoActualizado = await cronogramaService.updateEvento(id, { 
            titulo_evento, 
            fecha_evento, 
            descripcion, 
            tipo_evento, 
            esta_publicado: esta_publicado === 'true' || esta_publicado === true 
        });
        if (!eventoActualizado) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' });
        }
        res.json({ success: true, data: eventoActualizado });
    } catch (error) {
        console.error('Error al actualizar el evento:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar el evento' });
    }
};

exports.deleteEvento = async (req, res) => {
    const { id } = req.params;
    try {
        const eventoEliminado = await cronogramaService.deleteEvento(id);
        if (!eventoEliminado) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' });
        }
        res.json({ success: true, message: 'Evento eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar el evento' });
    }
};
