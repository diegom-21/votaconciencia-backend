const db = require('../config/database');

exports.getAllEventos = async () => {
    const [rows] = await db.query('SELECT * FROM eventos_cronograma ORDER BY fecha_evento ASC');
    return rows;
};

// Obtener eventos ordenados por proximidad a la fecha actual
exports.getEventosOrdenados = async () => {
    const [rows] = await db.query(`
        SELECT *, 
        ABS(DATEDIFF(fecha_evento, CURDATE())) as dias_diferencia,
        CASE 
            WHEN fecha_evento >= CURDATE() THEN 0 
            ELSE 1 
        END as es_pasado
        FROM eventos_cronograma 
        WHERE esta_publicado = 1
        ORDER BY es_pasado ASC, dias_diferencia ASC, fecha_evento ASC
    `);
    return rows;
};

// Obtener el próximo evento más cercano
exports.getProximoEvento = async () => {
    const [rows] = await db.query(`
        SELECT *, 
        ABS(DATEDIFF(fecha_evento, CURDATE())) as dias_diferencia
        FROM eventos_cronograma 
        WHERE esta_publicado = 1
        ORDER BY 
            CASE 
                WHEN fecha_evento >= CURDATE() THEN 0 
                ELSE 1 
            END ASC,
            ABS(DATEDIFF(fecha_evento, CURDATE())) ASC
        LIMIT 1
    `);
    return rows[0];
};

exports.getEventoById = async (id) => {
    const [rows] = await db.query('SELECT * FROM eventos_cronograma WHERE evento_id = ?', [id]);
    return rows[0];
};

exports.createEvento = async (eventoData) => {
    const { titulo_evento, fecha_evento, descripcion, tipo_evento, esta_publicado } = eventoData;
    const [result] = await db.query(
        'INSERT INTO eventos_cronograma (titulo_evento, fecha_evento, descripcion, tipo_evento, esta_publicado) VALUES (?, ?, ?, ?, ?)',
        [titulo_evento, fecha_evento, descripcion, tipo_evento, esta_publicado]
    );
    return { evento_id: result.insertId, ...eventoData };
};

exports.updateEvento = async (id, eventoData) => {
    const { titulo_evento, fecha_evento, descripcion, tipo_evento, esta_publicado } = eventoData;
    const [result] = await db.query(
        'UPDATE eventos_cronograma SET titulo_evento = ?, fecha_evento = ?, descripcion = ?, tipo_evento = ?, esta_publicado = ? WHERE evento_id = ?',
        [titulo_evento, fecha_evento, descripcion, tipo_evento, esta_publicado, id]
    );
    return result.affectedRows > 0 ? { evento_id: id, ...eventoData } : null;
};

exports.deleteEvento = async (id) => {
    const [result] = await db.query('DELETE FROM eventos_cronograma WHERE evento_id = ?', [id]);
    return result.affectedRows > 0;
};