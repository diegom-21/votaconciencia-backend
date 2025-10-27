const express = require('express');
const router = express.Router();
const propuestasController = require('../controllers/propuestasController');
const authMiddleware = require('../middleware/auth');

// Ruta pública (sin autenticación) - para la web pública
router.get('/', propuestasController.getAllPropuestas);

// Rutas protegidas (requieren autenticación) - para el panel admin
router.post('/', authMiddleware, propuestasController.createPropuesta);
router.put('/:id', authMiddleware, propuestasController.updatePropuesta);
router.delete('/:id', authMiddleware, propuestasController.deletePropuesta);

module.exports = router;
