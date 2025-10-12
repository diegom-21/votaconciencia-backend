const requireSuperAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    if (req.user.rol !== 'superadmin') {
        return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de superadmin' });
    }

    next();
};

module.exports = requireSuperAdmin;