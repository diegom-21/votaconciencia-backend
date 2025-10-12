const multer = require('multer');
const path = require('path');

// Función para crear configuración de almacenamiento con prefijo personalizado
const createStorage = (prefix = 'archivo') => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/images')
        },
        filename: function (req, file, cb) {
            // Crear un nombre de archivo único usando timestamp y extensión original
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, prefix + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });
};

// Filtro de archivos
const fileFilter = (req, file, cb) => {
    // Aceptar solo imágenes
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('No es un archivo de imagen válido'), false);
    }
};

// Función para crear configuración de multer con prefijo personalizado
const createUpload = (prefix = 'archivo') => {
    return multer({
        storage: createStorage(prefix),
        fileFilter: fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024 // Límite de 5MB
        }
    });
};

// Configuraciones específicas
const uploadCandidato = createUpload('candidato');
const uploadPartido = createUpload('partido');
const uploadTriviaTema = createUpload('triviaTema');
const uploadRecursoEducativo = createUpload('recursoEducativo');

// Exportar configuración por defecto (para compatibilidad) y específicas
module.exports = uploadCandidato; // Default para compatibilidad
module.exports.candidato = uploadCandidato;
module.exports.partido = uploadPartido;
module.exports.triviaTema = uploadTriviaTema;
module.exports.recursoEducativo = uploadRecursoEducativo;