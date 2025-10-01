const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getAllTemas,
    createTema,
    updateTema,
    deleteTema
} = require('../controllers/temasController');

// Obtener todos los temas
router.get('/', auth, getAllTemas);

// Crear un nuevo tema
router.post('/', auth, createTema);

// Actualizar un tema existente
router.put('/:tema_id', auth, updateTema);

// Eliminar un tema
router.delete('/:tema_id', auth, deleteTema);

module.exports = router;