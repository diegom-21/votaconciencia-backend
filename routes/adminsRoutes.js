const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/adminsController');

// Ruta para login de administradores
router.post('/login', loginAdmin);

module.exports = router;