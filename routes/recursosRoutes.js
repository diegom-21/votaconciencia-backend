const express = require('express');
const router = express.Router();
const recursosController = require('../controllers/recursosController');
const multer = require('../config/multer');

// Obtener todos los recursos educativos
router.get('/', recursosController.getAllRecursos);

// Obtener un recurso educativo específico
router.get('/:id', recursosController.getRecursoById);

// Crear un nuevo recurso educativo
router.post('/', multer.recursoEducativo.single('imagen'), recursosController.createRecurso);

// Actualizar un recurso educativo existente
router.put('/:id', multer.recursoEducativo.single('imagen'), recursosController.updateRecurso);

// Eliminar un recurso educativo
router.delete('/:id', recursosController.deleteRecurso);

module.exports = router;