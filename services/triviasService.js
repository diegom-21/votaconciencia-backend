const db = require('../config/database');

// Servicios para Temas
exports.getAllTemas = async () => {
    const [rows] = await db.query('SELECT * FROM trivia_temas');
    return rows;
};

exports.getTemaById = async (id) => {
    const [rows] = await db.query('SELECT * FROM trivia_temas WHERE tema_trivia_id = ?', [id]);
    return rows[0];
};

exports.createTema = async (temaData) => {
    const { nombre_tema, descripcion, imagen_url, esta_activo } = temaData;
    const [result] = await db.query(
        'INSERT INTO trivia_temas (nombre_tema, descripcion, imagen_url, esta_activo) VALUES (?, ?, ?, ?)',
        [nombre_tema, descripcion, imagen_url, esta_activo]
    );
    return { tema_trivia_id: result.insertId, ...temaData };
};

exports.updateTema = async (id, temaData) => {
    const { nombre_tema, descripcion, imagen_url, esta_activo } = temaData;
    const updateFields = [];
    const updateValues = [];

    if (nombre_tema !== undefined) {
        updateFields.push('nombre_tema = ?');
        updateValues.push(nombre_tema);
    }
    if (descripcion !== undefined) {
        updateFields.push('descripcion = ?');
        updateValues.push(descripcion);
    }
    if (imagen_url !== undefined) {
        updateFields.push('imagen_url = ?');
        updateValues.push(imagen_url);
    }
    if (esta_activo !== undefined) {
        updateFields.push('esta_activo = ?');
        updateValues.push(esta_activo);
    }

    updateValues.push(id);

    const [result] = await db.query(
        `UPDATE trivia_temas SET ${updateFields.join(', ')} WHERE tema_trivia_id = ?`,
        updateValues
    );

    return result.affectedRows > 0;
};

exports.deleteTema = async (id) => {
    const [result] = await db.query('DELETE FROM trivia_temas WHERE tema_trivia_id = ?', [id]);
    return result.affectedRows > 0;
};

// Servicios para Preguntas
exports.getPreguntasByTema = async (temaId) => {
    const [rows] = await db.query(
        'SELECT * FROM trivia_preguntas WHERE tema_trivia_id = ? ORDER BY orden_visualizacion',
        [temaId]
    );
    return rows;
};

exports.createPregunta = async (preguntaData) => {
    const { tema_trivia_id, texto_pregunta, orden_visualizacion } = preguntaData;
    const [result] = await db.query(
        'INSERT INTO trivia_preguntas (tema_trivia_id, texto_pregunta, orden_visualizacion) VALUES (?, ?, ?)',
        [tema_trivia_id, texto_pregunta, orden_visualizacion]
    );
    return { pregunta_id: result.insertId, ...preguntaData };
};

exports.updatePregunta = async (id, preguntaData) => {
    const { texto_pregunta, orden_visualizacion } = preguntaData;
    const [result] = await db.query(
        'UPDATE trivia_preguntas SET texto_pregunta = ?, orden_visualizacion = ? WHERE pregunta_id = ?',
        [texto_pregunta, orden_visualizacion, id]
    );
    return result.affectedRows > 0;
};

exports.deletePregunta = async (id) => {
    const [result] = await db.query('DELETE FROM trivia_preguntas WHERE pregunta_id = ?', [id]);
    return result.affectedRows > 0;
};

// Servicios para Opciones
exports.getOpcionesByPregunta = async (preguntaId) => {
    const [rows] = await db.query(
        'SELECT * FROM trivia_opciones WHERE pregunta_id = ?',
        [preguntaId]
    );
    return rows;
};

exports.createOpcion = async (opcionData) => {
    const { pregunta_id, texto_opcion, es_correcta } = opcionData;
    const [result] = await db.query(
        'INSERT INTO trivia_opciones (pregunta_id, texto_opcion, es_correcta) VALUES (?, ?, ?)',
        [pregunta_id, texto_opcion, es_correcta]
    );
    return { opcion_id: result.insertId, ...opcionData };
};

exports.updateOpcion = async (id, opcionData) => {
    const { texto_opcion, es_correcta } = opcionData;
    const [result] = await db.query(
        'UPDATE trivia_opciones SET texto_opcion = ?, es_correcta = ? WHERE opcion_id = ?',
        [texto_opcion, es_correcta, id]
    );
    return result.affectedRows > 0;
};

exports.deleteOpcion = async (id) => {
    const [result] = await db.query('DELETE FROM trivia_opciones WHERE opcion_id = ?', [id]);
    return result.affectedRows > 0;
};
