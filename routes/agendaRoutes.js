const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');


router.get('/', agendaController.listarAgendas);
router.get('/generarTurnosAgendas', agendaController.generarTurnosAgendas);
router.get('/generar-turnos/:id', agendaController.generarTurnosDiarios);
router.get('/vistaCrear', agendaController.vistaCrear);
router.post('/', agendaController.crearAgenda);
router.get('/editar/:id', agendaController.vistaActualizar);
router.post('/actualizar', agendaController.actualizarAgenda);
router.get('/:id/turnos', agendaController.verTurnosAgenda);
router.get('/asignar/:turnoId', agendaController.mostrarAsignacionPaciente);
router.post('/asignar', agendaController.asignarPaciente);

module.exports = router;