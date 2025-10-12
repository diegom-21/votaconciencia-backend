const express = require('express');
const router = express.Router();
const triviasController = require('../controllers/triviasController');
const multer = require('../config/multer');

// Rutas para temas de trivia
router.get('/temas', triviasController.getAllTemas);
router.get('/temas/:id', triviasController.getTemaById);
router.post('/temas', multer.triviaTema.single('imagen'), triviasController.createTema);
router.put('/temas/:id', multer.triviaTema.single('imagen'), triviasController.updateTema);
router.delete('/temas/:id', triviasController.deleteTema);

// Rutas para preguntas
router.get('/preguntas/tema/:temaId', triviasController.getPreguntasByTema);
router.post('/preguntas', triviasController.createPregunta);
router.put('/preguntas/:id', triviasController.updatePregunta);
router.delete('/preguntas/:id', triviasController.deletePregunta);

// Rutas para opciones
router.get('/opciones/pregunta/:preguntaId', triviasController.getOpcionesByPregunta);
router.post('/opciones', triviasController.createOpcion);
router.put('/opciones/:id', triviasController.updateOpcion);
router.delete('/opciones/:id', triviasController.deleteOpcion);

module.exports = router;
