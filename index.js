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

const app = express();

// Middlewares
app.use(cors());
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

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});