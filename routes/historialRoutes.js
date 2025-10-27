const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getHistorialByCandidatoId,
    addHistorialEntry,
    updateHistorialEntry,
    deleteHistorialEntry,
    createSampleHistorial
} = require('../controllers/historialController');

// Obtener historial por candidato
router.get('/candidato/:candidatoId', getHistorialByCandidatoId);

// Crear datos de ejemplo para un candidato (solo para desarrollo)
router.post('/sample/:candidatoId', createSampleHistorial);

// Crear nueva entrada
router.post('/', auth, addHistorialEntry);

// Actualizar entrada existente
router.put('/:historialId', auth, updateHistorialEntry);

// Eliminar entrada
router.delete('/:historialId', auth, deleteHistorialEntry);

module.exports = router;