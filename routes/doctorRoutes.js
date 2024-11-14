const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.get('/', doctorController.listarDoctores);
router.get('/Crear', doctorController.vistaDoctor);
router.post('/', doctorController.crearDoctor);
router.get('/editar/:id', doctorController.editarDoctor);
router.post('/actualizar', doctorController.actualizarDoctor);
router.post('/estado/:id', doctorController.cambiarEstadoDoctor);
router.get('/:id/especialidades', doctorController.listarEspecialidadesDeDoctor);
router.post('/:id/especialidades/asignar', doctorController.asignarEspecialidad);
router.get('/:doctorId/especialidades/eliminar/:especialidadId', doctorController.eliminarEspecialidad);
module.exports = router;
 