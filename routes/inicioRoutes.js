const express = require('express');
const router = express.Router();
const mainController = require('../controllers/inicioController');
const estaAunteticado = require('../middlewares/estaAunteticado');

router.get('/inicio', [estaAunteticado,], mainController.vistaInicio); // Ruta para la vista de inicio

module.exports = router;
