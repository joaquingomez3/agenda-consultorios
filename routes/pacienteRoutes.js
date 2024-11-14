const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.get('/', pacienteController.listarPacientes);
router.get('/Crear', pacienteController.vistaPaciente);
router.post('/', pacienteController.crearPaciente);
router.get('/editar/:id', pacienteController.editarPaciente);
router.post('/actualizar', pacienteController.actualizarPaciente);


module.exports = router;