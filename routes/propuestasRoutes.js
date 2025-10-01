const express = require('express');
const router = express.Router();
const propuestasController = require('../controllers/propuestasController');
const authMiddleware = require('../middleware/auth');

// Rutas protegidas para propuestas
router.get('/', authMiddleware, propuestasController.getAllPropuestas);
router.post('/', authMiddleware, propuestasController.createPropuesta);
router.put('/:id', authMiddleware, propuestasController.updatePropuesta);
router.delete('/:id', authMiddleware, propuestasController.deletePropuesta);

module.exports = router;
