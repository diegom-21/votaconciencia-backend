const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getAllTemas,
    createTema,
    updateTema,
    deleteTema
} = require('../controllers/temasController');

// Ruta pública (sin autenticación) - para la web pública
router.get('/', getAllTemas);

// Rutas protegidas (requieren autenticación) - para el panel admin
router.post('/', auth, createTema);
router.put('/:tema_id', auth, updateTema);
router.delete('/:tema_id', auth, deleteTema);

module.exports = router;