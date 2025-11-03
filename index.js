const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/database');
const { initializeDatabase } = require('./scripts/initDatabase');
const candidatosRoutes = require('./routes/candidatosRoutes');
const adminsRoutes = require('./routes/adminsRoutes');
const partidosRoutes = require('./routes/partidosRoutes');
const temasRoutes = require('./routes/temasRoutes');
const historialRoutes = require('./routes/historialRoutes');
const propuestasRoutes = require('./routes/propuestasRoutes');
const cronogramaRoutes = require('./routes/cronogramaRoutes');
const triviasRoutes = require('./routes/triviasRoutes');
const recursosRoutes = require('./routes/recursosRoutes');
const administradoresRoutes = require('./routes/administradoresRoutes');
const openaiRoutes = require('./routes/openaiRoutes');

const app = express();

// Middlewares
const corsOptions = {
    origin: '*', // Permitir todos los orígenes
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Servir archivos estáticos
app.use('/uploads', express.static('public/uploads'));

// Asegurarse de que el directorio de uploads existe
const fs = require('fs');
const path = require('path');
const uploadDir = path.join(__dirname, 'public/uploads/images');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: "API de VotaConCiencia funcionando" });
});

// Rutas de la API
app.use('/api/candidatos', candidatosRoutes);
app.use('/api/admins', adminsRoutes);
app.use('/api/partidos', partidosRoutes);
app.use('/api/temas', temasRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/propuestas', propuestasRoutes);
app.use('/api/cronograma', cronogramaRoutes);
app.use('/api/trivias', triviasRoutes);
app.use('/api/recursos', recursosRoutes);
app.use('/api/administradores', administradoresRoutes);
app.use('/api/openai', openaiRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;

// Función para iniciar el servidor con inicialización de BD
async function startServer() {
    try {
        // Inicializar base de datos antes de iniciar el servidor
        console.log('🚀 Iniciando servidor VotaConCiencia...\n');
        
        const dbInitialized = await initializeDatabase();
        
        if (!dbInitialized) {
            console.error('⚠️  Advertencia: La base de datos no se inicializó correctamente.');
            console.error('   El servidor continuará, pero puede haber errores.\n');
        }
        
        // Iniciar servidor Express
        app.listen(PORT, () => {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        });
        
    } catch (error) {
        console.error('❌ Error fatal al iniciar el servidor:', error);
        process.exit(1);
    }
}

// Iniciar el servidor
startServer();