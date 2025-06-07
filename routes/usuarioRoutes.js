const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/crear', usuarioController.mostrarFormulario);
router.post('/crear', usuarioController.crearUsuario);
router.get('/editar/:dni', usuarioController.mostrarFormularioEditar);
router.post('/editar', usuarioController.editarUsuario);



module.exports = router;
