const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const chequeo = require ('../middlewares/authMiddleware');
router.get('/', chequeo, pacienteController.listarPacientes);
router.get('/Crear', chequeo, pacienteController.vistaPaciente);
router.post('/', pacienteController.crearPaciente);
router.get('/editar/:id', chequeo, pacienteController.editarPaciente);
router.post('/actualizar', pacienteController.actualizarPaciente);


module.exports = router;