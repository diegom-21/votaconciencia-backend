const express = require('express');
const router = express.Router();
const cronogramaController = require('../controllers/cronogramaController');

// Listar todos los eventos
router.get('/', cronogramaController.getAllEventos);

// Obtener eventos ordenados por proximidad a la fecha actual
router.get('/ordenados', cronogramaController.getEventosOrdenados);

// Obtener el próximo evento más cercano
router.get('/proximo', cronogramaController.getProximoEvento);

// Obtener un evento específico
router.get('/:id', cronogramaController.getEventoById);

// Crear un nuevo evento
router.post('/', cronogramaController.createEvento);

// Actualizar un evento existente
router.put('/:id', cronogramaController.updateEvento);

// Eliminar un evento
router.delete('/:id', cronogramaController.deleteEvento);

module.exports = router;
