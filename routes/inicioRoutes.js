
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/inicio', authMiddleware, (req, res) => {
    const success = req.query.success;
    res.render('inicio', { usuario: req.user, success: success });

});

module.exports = router;
