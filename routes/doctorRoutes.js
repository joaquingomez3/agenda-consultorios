const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const chequeo = require ('../middlewares/estaAunteticado');

router.get('/', chequeo, doctorController.listarDoctores);
router.get('/Crear', chequeo, doctorController.vistaDoctor);
router.post('/', doctorController.crearDoctor);
router.get('/editar/:id', chequeo, doctorController.editarDoctor);
router.post('/actualizar', chequeo, doctorController.actualizarDoctor);
router.post('/estado/:id', doctorController.cambiarEstadoDoctor);
router.get('/:id/especialidades', chequeo, doctorController.listarEspecialidadesDeDoctor);
router.post('/:id/especialidades/asignar', doctorController.asignarEspecialidad);
router.get('/:doctorId/especialidades/eliminar/:especialidadId', chequeo, doctorController.eliminarEspecialidad);
module.exports = router;
 