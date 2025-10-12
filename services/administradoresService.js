const db = require('../config/database');

exports.getAllAdministradores = async () => {
    const [rows] = await db.query('SELECT * FROM administradores ORDER BY nombre');
    return rows;
};

exports.getAdministradorById = async (id) => {
    const [rows] = await db.query('SELECT * FROM administradores WHERE admin_id = ?', [id]);
    return rows[0];
};

exports.getAdministradorByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM administradores WHERE email = ?', [email]);
    return rows[0];
};

exports.createAdministrador = async (adminData) => {
    const { nombre, email, password_hash, rol, esta_activo } = adminData;
    const [result] = await db.query(
        'INSERT INTO administradores (nombre, email, password_hash, rol, esta_activo) VALUES (?, ?, ?, ?, ?)',
        [nombre, email, password_hash, rol, esta_activo]
    );
    return { admin_id: result.insertId, ...adminData };
};

exports.updateAdministrador = async (id, adminData) => {
    const { nombre, email, password_hash, rol, esta_activo } = adminData;
    const updateFields = [];
    const updateValues = [];

    if (nombre !== undefined) {
        updateFields.push('nombre = ?');
        updateValues.push(nombre);
    }
    if (email !== undefined) {
        updateFields.push('email = ?');
        updateValues.push(email);
    }
    if (password_hash !== undefined) {
        updateFields.push('password_hash = ?');
        updateValues.push(password_hash);
    }
    if (rol !== undefined) {
        updateFields.push('rol = ?');
        updateValues.push(rol);
    }
    if (esta_activo !== undefined) {
        updateFields.push('esta_activo = ?');
        updateValues.push(esta_activo);
    }

    updateValues.push(id);

    const [result] = await db.query(
        `UPDATE administradores SET ${updateFields.join(', ')} WHERE admin_id = ?`,
        updateValues
    );

    if (result.affectedRows > 0) {
        return await this.getAdministradorById(id);
    }
    return null;
};

exports.deleteAdministrador = async (id) => {
    const [result] = await db.query('DELETE FROM administradores WHERE admin_id = ?', [id]);
    return result.affectedRows > 0;
};
