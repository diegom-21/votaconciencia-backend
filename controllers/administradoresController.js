const administradoresService = require('../services/administradoresService');
const bcrypt = require('bcrypt');

exports.getAllAdministradores = async (req, res) => {
    try {
        const administradores = await administradoresService.getAllAdministradores();
        // No retornar las contraseñas
        const administradoresSinPassword = administradores.map(admin => {
            const { password_hash, ...adminSinPassword } = admin;
            return adminSinPassword;
        });
        res.json(administradoresSinPassword);
    } catch (error) {
        console.error('Error al obtener administradores:', error);
        res.status(500).json({ error: 'Error al obtener los administradores' });
    }
};

exports.getAdministradorById = async (req, res) => {
    try {
        const administrador = await administradoresService.getAdministradorById(req.params.id);
        if (!administrador) {
            return res.status(404).json({ error: 'Administrador no encontrado' });
        }
        // No retornar la contraseña
        const { password_hash, ...adminSinPassword } = administrador;
        res.json(adminSinPassword);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el administrador' });
    }
};

exports.createAdministrador = async (req, res) => {
    try {
        const { nombre, email, password, rol, esta_activo } = req.body;

        // Validar que se proporcione una contraseña
        if (!password) {
            return res.status(400).json({ error: 'La contraseña es requerida' });
        }

        // Verificar si el email ya existe
        const adminExistente = await administradoresService.getAdministradorByEmail(email);
        if (adminExistente) {
            return res.status(400).json({ error: 'Ya existe un administrador con este email' });
        }

        // Hashear la contraseña
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const administrador = await administradoresService.createAdministrador({
            nombre,
            email,
            password_hash,
            rol: rol || 'editor',
            esta_activo: esta_activo !== undefined ? esta_activo : true
        });

        // No retornar la contraseña
        const { password_hash: _, ...adminSinPassword } = administrador;
        res.status(201).json(adminSinPassword);
    } catch (error) {
        console.error('Error al crear administrador:', error);
        res.status(500).json({ error: 'Error al crear el administrador' });
    }
};

exports.updateAdministrador = async (req, res) => {
    try {
        const { nombre, email, password, rol, esta_activo } = req.body;
        const adminId = req.params.id;

        // Verificar que el administrador existe
        const adminExistente = await administradoresService.getAdministradorById(adminId);
        if (!adminExistente) {
            return res.status(404).json({ error: 'Administrador no encontrado' });
        }

        // Si se está cambiando el email, verificar que no exista otro admin con ese email
        if (email && email !== adminExistente.email) {
            const adminConEmail = await administradoresService.getAdministradorByEmail(email);
            if (adminConEmail) {
                return res.status(400).json({ error: 'Ya existe un administrador con este email' });
            }
        }

        // Prevenir que el superadmin se quite a sí mismo el rol de superadmin
        if (req.user.id == adminId && req.user.rol === 'superadmin' && rol === 'editor') {
            return res.status(400).json({ error: 'No puedes cambiar tu propio rol de superadmin' });
        }

        // Prevenir que el superadmin se desactive a sí mismo
        if (req.user.id == adminId && esta_activo === false) {
            return res.status(400).json({ error: 'No puedes desactivar tu propia cuenta' });
        }

        const updateData = {
            nombre,
            email,
            rol,
            esta_activo
        };

        // Si se proporciona una nueva contraseña, hashearla
        if (password) {
            const saltRounds = 10;
            updateData.password_hash = await bcrypt.hash(password, saltRounds);
        }

        const administrador = await administradoresService.updateAdministrador(adminId, updateData);
        
        // No retornar la contraseña
        const { password_hash: _, ...adminSinPassword } = administrador;
        res.json(adminSinPassword);
    } catch (error) {
        console.error('Error al actualizar administrador:', error);
        res.status(500).json({ error: 'Error al actualizar el administrador' });
    }
};

exports.deleteAdministrador = async (req, res) => {
    try {
        const adminId = req.params.id;

        // Verificar que el administrador existe
        const administrador = await administradoresService.getAdministradorById(adminId);
        if (!administrador) {
            return res.status(404).json({ error: 'Administrador no encontrado' });
        }

        // Prevenir que el superadmin se elimine a sí mismo
        if (req.user.id == adminId) {
            return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
        }

        await administradoresService.deleteAdministrador(adminId);
        res.json({ message: 'Administrador eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el administrador' });
    }
};
