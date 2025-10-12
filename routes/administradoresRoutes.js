const express = require('express');
const router = express.Router();
const administradoresController = require('../controllers/administradoresController');
const authenticateToken = require('../middleware/auth');
const requireSuperAdmin = require('../middleware/requireSuperAdmin');

// Todas las rutas requieren autenticación y rol superadmin
router.use(authenticateToken);
router.use(requireSuperAdmin);

// Obtener todos los administradores
router.get('/', administradoresController.getAllAdministradores);

// Obtener un administrador específico
router.get('/:id', administradoresController.getAdministradorById);

// Crear un nuevo administrador
router.post('/', administradoresController.createAdministrador);

// Actualizar un administrador existente
router.put('/:id', administradoresController.updateAdministrador);

// Eliminar un administrador
router.delete('/:id', administradoresController.deleteAdministrador);

module.exports = router;
