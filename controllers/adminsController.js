const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Función para iniciar sesión
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar administrador por email
        const [admins] = await pool.query(
            'SELECT * FROM administradores WHERE email = ?',
            [email]
        );

        if (admins.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const admin = admins[0];

        // Verificar la contraseña
        const passwordMatch = await bcrypt.compare(password, admin.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: admin.administrador_id, 
                email: admin.email,
                rol: admin.rol
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Devolver respuesta exitosa con token
        res.json({
            message: 'Login exitoso',
            token,
            admin: {
                id: admin.administrador_id,
                nombre: admin.nombre,
                email: admin.email,
                rol: admin.rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    loginAdmin
};