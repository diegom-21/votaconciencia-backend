/**
 * Script de inicialización de base de datos
 * Crea la base de datos, tablas y usuarios administradores por defecto
 * Se ejecuta automáticamente en el primer arranque del proyecto
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// SQL para crear la base de datos
const CREATE_DATABASE = `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\`;`;

// SQL para crear las tablas
const CREATE_TABLES = `
-- 1. TABLA DE ADMINISTRADORES
CREATE TABLE IF NOT EXISTS \`administradores\` (
  \`admin_id\` INT NOT NULL AUTO_INCREMENT,
  \`nombre\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`rol\` ENUM('superadmin', 'editor') NOT NULL DEFAULT 'editor',
  \`esta_activo\` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (\`admin_id\`)
);

-- 2. TABLA DE PARTIDOS POLÍTICOS
CREATE TABLE IF NOT EXISTS \`partidos\` (
  \`partido_id\` INT NOT NULL AUTO_INCREMENT,
  \`nombre\` VARCHAR(255) NOT NULL UNIQUE,
  \`logo_url\` VARCHAR(255) NULL,
  \`fecha_creacion\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`partido_id\`)
);

-- 3. TABLA DE CANDIDATOS
CREATE TABLE IF NOT EXISTS \`candidatos\` (
  \`candidato_id\` INT NOT NULL AUTO_INCREMENT,
  \`nombre\` VARCHAR(100) NOT NULL,
  \`apellido\` VARCHAR(100) NOT NULL,
  \`foto_url\` VARCHAR(255) NULL,
  \`biografia\` TEXT NULL,
  \`lugar_nacimiento\` VARCHAR(255) NULL,
  \`partido_id\` INT NULL,
  \`plan_gobierno_completo\` LONGTEXT NULL COMMENT 'Texto completo del plan de gobierno, fuente para la IA.',
  \`openai_assistant_id\` VARCHAR(255) NULL COMMENT 'ID del Asistente de OpenAI asociado a este candidato.',
  \`esta_activo\` TINYINT(1) NULL DEFAULT 1,
  PRIMARY KEY (\`candidato_id\`),
  FOREIGN KEY (\`partido_id\`) REFERENCES \`partidos\`(\`partido_id\`) ON DELETE SET NULL
);

-- 4. TABLA DE HISTORIAL POLÍTICO
CREATE TABLE IF NOT EXISTS \`historial_politico\` (
  \`historial_id\` INT NOT NULL AUTO_INCREMENT,
  \`candidato_id\` INT NOT NULL,
  \`cargo\` VARCHAR(255) NOT NULL,
  \`institucion\` VARCHAR(255) NULL,
  \`ano_inicio\` YEAR NOT NULL,
  \`ano_fin\` YEAR NULL,
  PRIMARY KEY (\`historial_id\`),
  FOREIGN KEY (\`candidato_id\`) REFERENCES \`candidatos\`(\`candidato_id\`) ON DELETE CASCADE
);

-- 5. TABLA DE TEMAS
CREATE TABLE IF NOT EXISTS \`temas\` (
  \`tema_id\` INT NOT NULL AUTO_INCREMENT,
  \`nombre_tema\` VARCHAR(100) NOT NULL UNIQUE,
  \`icono_url\` VARCHAR(255) NULL,
  PRIMARY KEY (\`tema_id\`)
);

-- 6. TABLA DE PROPUESTAS
CREATE TABLE IF NOT EXISTS \`propuestas\` (
  \`propuesta_id\` INT NOT NULL AUTO_INCREMENT,
  \`candidato_id\` INT NOT NULL,
  \`tema_id\` INT NOT NULL,
  \`titulo_propuesta\` VARCHAR(255) NOT NULL,
  \`resumen_ia\` TEXT NOT NULL COMMENT 'Resumen generado por IA para un tema específico.',
  PRIMARY KEY (\`propuesta_id\`),
  FOREIGN KEY (\`candidato_id\`) REFERENCES \`candidatos\`(\`candidato_id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`tema_id\`) REFERENCES \`temas\`(\`tema_id\`) ON DELETE CASCADE
);

-- 7. TABLA DE RECURSOS EDUCATIVOS
CREATE TABLE IF NOT EXISTS \`recursos_educativos\` (
  \`recurso_id\` INT NOT NULL AUTO_INCREMENT,
  \`titulo\` VARCHAR(255) NOT NULL,
  \`imagen_url\` VARCHAR(255) NULL,
  \`contenido_html\` TEXT NOT NULL,
  \`esta_publicado\` TINYINT(1) NULL DEFAULT 1,
  \`fecha_creacion\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`recurso_id\`)
);

-- 8. TABLA DE EVENTOS DEL CRONOGRAMA
CREATE TABLE IF NOT EXISTS \`eventos_cronograma\` (
  \`evento_id\` INT NOT NULL AUTO_INCREMENT,
  \`titulo_evento\` VARCHAR(255) NOT NULL,
  \`fecha_evento\` DATE NOT NULL,
  \`descripcion\` TEXT NULL,
  \`tipo_evento\` ENUM('Debate', 'Inscripción', 'Elección', 'Hito', 'Otro') NOT NULL,
  \`esta_publicado\` TINYINT(1) NULL DEFAULT 1,
  PRIMARY KEY (\`evento_id\`)
);

-- 9. TABLA DE TRIVIA - TEMAS
CREATE TABLE IF NOT EXISTS \`trivia_temas\` (
  \`tema_trivia_id\` INT NOT NULL AUTO_INCREMENT,
  \`nombre_tema\` VARCHAR(255) NOT NULL UNIQUE,
  \`descripcion\` TEXT NULL,
  \`imagen_url\` VARCHAR(255) NULL,
  \`esta_activo\` TINYINT(1) NULL DEFAULT 1,
  PRIMARY KEY (\`tema_trivia_id\`)
);

-- 10. TABLA DE TRIVIA - PREGUNTAS
CREATE TABLE IF NOT EXISTS \`trivia_preguntas\` (
  \`pregunta_id\` INT NOT NULL AUTO_INCREMENT,
  \`tema_trivia_id\` INT NOT NULL,
  \`texto_pregunta\` TEXT NOT NULL,
  \`orden_visualizacion\` INT NULL DEFAULT 0,
  PRIMARY KEY (\`pregunta_id\`),
  FOREIGN KEY (\`tema_trivia_id\`) REFERENCES \`trivia_temas\`(\`tema_trivia_id\`) ON DELETE CASCADE
);

-- 11. TABLA DE TRIVIA - OPCIONES
CREATE TABLE IF NOT EXISTS \`trivia_opciones\` (
  \`opcion_id\` INT NOT NULL AUTO_INCREMENT,
  \`pregunta_id\` INT NOT NULL,
  \`texto_opcion\` VARCHAR(500) NOT NULL,
  \`es_correcta\` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (\`opcion_id\`),
  FOREIGN KEY (\`pregunta_id\`) REFERENCES \`trivia_preguntas\`(\`pregunta_id\`) ON DELETE CASCADE
);
`;

// SQL para insertar usuarios administradores por defecto
const INSERT_DEFAULT_ADMINS = `
INSERT IGNORE INTO administradores (nombre, email, password_hash, rol) VALUES
-- Superadmins (contraseña: superadmin123)
('Superadmin 1', 'superadmin1@votaconciencia.pe', '$2b$10$Y6kKxdDbwg1PZaHNtPF8uenrkjQiQSSp1K57VJo9rjJWfrKLkcx4W', 'superadmin'),
('Superadmin 2', 'superadmin2@votaconciencia.pe', '$2b$10$Y6kKxdDbwg1PZaHNtPF8uenrkjQiQSSp1K57VJo9rjJWfrKLkcx4W', 'superadmin'),
('Superadmin 3', 'superadmin3@votaconciencia.pe', '$2b$10$Y6kKxdDbwg1PZaHNtPF8uenrkjQiQSSp1K57VJo9rjJWfrKLkcx4W', 'superadmin'),
-- Editores (contraseña: editor123)
('Editor 1', 'editor1@votaconciencia.pe', '$2b$10$dyIN41YpqJ.2AQpfzJPW8.Yw66.xD4xuylQbVdxmkYRaQi3pWEyP.', 'editor'),
('Editor 2', 'editor2@votaconciencia.pe', '$2b$10$dyIN41YpqJ.2AQpfzJPW8.Yw66.xD4xuylQbVdxmkYRaQi3pWEyP.', 'editor'),
('Editor 3', 'editor3@votaconciencia.pe', '$2b$10$dyIN41YpqJ.2AQpfzJPW8.Yw66.xD4xuylQbVdxmkYRaQi3pWEyP.', 'editor');
`;

/**
 * Función principal de inicialización
 */
async function initializeDatabase() {
  let connection;
  
  try {
    console.log('🔧 Iniciando configuración de base de datos...\n');

    // Conectar a MySQL sin especificar base de datos
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    console.log('✅ Conexión a MySQL establecida');

    // 1. Crear base de datos
    console.log(`📦 Creando base de datos '${process.env.DB_DATABASE}'...`);
    await connection.query(CREATE_DATABASE);
    console.log('✅ Base de datos creada o ya existente\n');

    // 2. Seleccionar la base de datos
    await connection.query(`USE \`${process.env.DB_DATABASE}\`;`);

    // 3. Crear tablas
    console.log('📋 Creando tablas...');
    const statements = CREATE_TABLES.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }
    console.log('✅ Tablas creadas exitosamente\n');

    // 4. Verificar si ya existen administradores
    const [admins] = await connection.query('SELECT COUNT(*) as count FROM administradores');
    
    if (admins[0].count === 0) {
      console.log('👥 Insertando usuarios administradores por defecto...');
      await connection.query(INSERT_DEFAULT_ADMINS);
      console.log('✅ Usuarios administradores creados\n');
      
      console.log('📝 Credenciales de acceso:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('SUPERADMINS:');
      console.log('  📧 Email: superadmin1@votaconciencia.pe (también 2 y 3)');
      console.log('  🔑 Contraseña: superadmin123\n');
      console.log('EDITORES:');
      console.log('  📧 Email: editor1@votaconciencia.pe (también 2 y 3)');
      console.log('  🔑 Contraseña: editor123');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else {
      console.log('ℹ️  Ya existen usuarios administradores en la base de datos\n');
    }

    console.log('🎉 ¡Inicialización completada exitosamente!\n');
    
    return true;

  } catch (error) {
    console.error('❌ Error durante la inicialización de la base de datos:');
    console.error(error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n⚠️  Verifica tus credenciales de MySQL en el archivo .env');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  No se pudo conectar a MySQL. Asegúrate de que el servidor esté ejecutándose.');
    }
    
    return false;

  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeDatabase()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(err => {
      console.error('Error fatal:', err);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
