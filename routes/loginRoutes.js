const express = require('express');
const router = express.Router();
const authController = require('../controllers/loginController');

router.get('/', authController.mostrarLogin);
router.post('/login', authController.procesarLogin);

module.exports = router;
