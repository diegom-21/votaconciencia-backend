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

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todos los partidos
router.get('/', getAllPartidos);

// Obtener un partido específico
router.get('/:id', getPartidoById);

// Crear un nuevo partido
router.post('/', upload.partido.single('logo'), createPartido);

// Actualizar un partido existente
router.put('/:id', upload.partido.single('logo'), updatePartido);

// Eliminar un partido
router.delete('/:id', deletePartido);

module.exports = router;