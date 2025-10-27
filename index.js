const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/database');
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
    origin: [
        'http://localhost:5173', // Admin frontend (votaconcienciafront)
        'http://localhost:5174', // Public frontend (votaconcienciapublic)
        'http://localhost:3001', // Posible puerto alternativo
        'http://localhost:4173', // Vite preview
        'http://localhost:4174'  // Vite preview alternativo
    ],
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
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});