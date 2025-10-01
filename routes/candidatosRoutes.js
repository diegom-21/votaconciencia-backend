const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
    getAllCandidatos,
    getCandidatoById,
    createCandidato,
    updateCandidato,
    deleteCandidato
} = require('../controllers/candidatosController');

// Obtener todos los candidatos
router.get('/', getAllCandidatos);

// Obtener un candidato específico
router.get('/:id', getCandidatoById);

// Crear un nuevo candidato
router.post('/', upload.single('foto'), createCandidato);

// Actualizar un candidato existente
router.put('/:id', upload.single('foto'), updateCandidato);

// Eliminar un candidato
router.delete('/:id', deleteCandidato);

module.exports = router;