const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/crear', usuarioController.mostrarFormulario);
router.post('/crear', usuarioController.crearUsuario);


module.exports = router;
