const express = require('express');
const router = express.Router();
const mainController = require('../controllers/inicioController');
// const estaAunteticado = require('../middlewares/estaAunteticado');
const chequeo = require ('../middlewares/estaAunteticado');


router.get('/inicio', chequeo, mainController.vistaInicio); // Ruta para la vista de inicio

module.exports = router;
