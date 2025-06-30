const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');
const chequeo = require ('../middlewares/authMiddleware');

router.get('/', chequeo, agendaController.listarAgendas);
// router.get('/generarTurnosAgendas', chequeo, agendaController.generarTurnosAgendas);
// router.get('/generar-turnos/:id', chequeo, agendaController.generarTurnosDiarios);
router.get('/vistaCrear', chequeo, agendaController.formularioCrearAgenda);
router.get('/vistaCrear', chequeo, agendaController.vistaCrear);
router.post('/', agendaController.crearAgenda);
router.get('/editar/:id', chequeo, agendaController.vistaActualizar);
router.post('/actualizar', agendaController.actualizarAgenda);
router.get('/:id/turnos', chequeo, agendaController.verTurnosAgenda);
router.get('/:id/turnos/:fecha', chequeo, agendaController.verTurnosAgenda);
router.get('/asignar/:turnoId', chequeo, agendaController.mostrarAsignacionPaciente);
router.post('/asignar', agendaController.asignarPaciente);
router.get('/:id/sobreturnos/crear', chequeo, agendaController.vistaCrearSobreturno);
router.post('/:id/sobreturnos/crear', chequeo, agendaController.crearSobreturno);

module.exports = router;