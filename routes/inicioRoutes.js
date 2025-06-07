
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/inicio', authMiddleware, (req, res) => {
    
    res.render('inicio', { usuario: req.user });

});

module.exports = router;
