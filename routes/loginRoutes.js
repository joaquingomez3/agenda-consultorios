const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.get('/', loginController.mostrarLogin); //ruta para mostrar el login
router.post('/login', loginController.procesarLogin); //ruta para procesar el login
router.get('/logout', (req, res) => {
    res.clearCookie('jwt'); // Elimina la cookie con el token
    res.redirect('/'); // Redirige al login
});


module.exports = router;
