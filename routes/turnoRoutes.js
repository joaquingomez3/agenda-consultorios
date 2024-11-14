const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');

// Ruta para listar los turnos futuros (o de hoy)
router.get('/listar', turnoController.listarTurnos);

// Ruta para agendar (reservar) un turno para un paciente
router.post('/agendar', turnoController.agendarTurno);

// Ruta para generar turnos automáticamente para todas las agendas
router.post('/generarTurnos', turnoController.generarTurnosAutomáticamente);

// Exporta las rutas
module.exports = router;
