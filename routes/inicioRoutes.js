const express = require('express');
const router = express.Router();
const mainController = require('../controllers/inicioController');

router.get('/inicio', mainController.vistaInicio); // Ruta para la vista de inicio

module.exports = router;
