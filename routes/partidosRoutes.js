const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
    getAllPartidos,
    getPartidoById,
    createPartido,
    updatePartido,
    deletePartido
} = require('../controllers/partidosController');

// Middleware de autenticación
const authenticateToken = require('../middleware/auth');

// Rutas públicas (sin autenticación) - para la web pública
router.get('/', getAllPartidos);           // Obtener todos los partidos
router.get('/:id', getPartidoById);        // Obtener un partido específico

// Rutas protegidas (requieren autenticación) - para el panel admin
router.post('/', authenticateToken, upload.partido.single('logo'), createPartido);
router.put('/:id', authenticateToken, upload.partido.single('logo'), updatePartido);
router.delete('/:id', authenticateToken, deletePartido);

module.exports = router;