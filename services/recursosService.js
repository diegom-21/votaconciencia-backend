const db = require('../config/database');

exports.getAllRecursos = async () => {
    const [rows] = await db.query('SELECT * FROM recursos_educativos ORDER BY fecha_creacion DESC');
    return rows;
};

exports.getRecursoById = async (id) => {
    const [rows] = await db.query('SELECT * FROM recursos_educativos WHERE recurso_id = ?', [id]);
    return rows[0];
};

exports.createRecurso = async (recursoData) => {
    const { titulo, contenido_html, imagen_url, esta_publicado } = recursoData;
    const [result] = await db.query(
        'INSERT INTO recursos_educativos (titulo, contenido_html, imagen_url, esta_publicado) VALUES (?, ?, ?, ?)',
        [titulo, contenido_html, imagen_url, esta_publicado]
    );
    return { recurso_id: result.insertId, ...recursoData };
};

exports.updateRecurso = async (id, recursoData) => {
    const { titulo, contenido_html, imagen_url, esta_publicado } = recursoData;
    const updateFields = [];
    const updateValues = [];

    if (titulo !== undefined) {
        updateFields.push('titulo = ?');
        updateValues.push(titulo);
    }
    if (contenido_html !== undefined) {
        updateFields.push('contenido_html = ?');
        updateValues.push(contenido_html);
    }
    if (imagen_url !== undefined) {
        updateFields.push('imagen_url = ?');
        updateValues.push(imagen_url);
    }
    if (esta_publicado !== undefined) {
        updateFields.push('esta_publicado = ?');
        updateValues.push(esta_publicado);
    }

    updateValues.push(id);

    const [result] = await db.query(
        `UPDATE recursos_educativos SET ${updateFields.join(', ')} WHERE recurso_id = ?`,
        updateValues
    );

    return result.affectedRows > 0;
};

exports.deleteRecurso = async (id) => {
    const [result] = await db.query('DELETE FROM recursos_educativos WHERE recurso_id = ?', [id]);
    return result.affectedRows > 0;
};