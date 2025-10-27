const express = require('express');
const router = express.Router();
const { consultarIA } = require('../controllers/openaiControllerSimple');

/**
 * Rutas para consultas de IA sobre candidatos
 */

// POST /api/openai/consultar - Consultar a la IA sobre un candidato
router.post('/consultar', consultarIA);

module.exports = router;