const express = require('express');
const router = express.Router();
const cronogramaController = require('../controllers/cronogramaController');

// Listar todos los eventos
router.get('/', cronogramaController.getAllEventos);

// Obtener un evento específico
router.get('/:id', cronogramaController.getEventoById);

// Crear un nuevo evento
router.post('/', cronogramaController.createEvento);

// Actualizar un evento existente
router.put('/:id', cronogramaController.updateEvento);

// Eliminar un evento
router.delete('/:id', cronogramaController.deleteEvento);

module.exports = router;
