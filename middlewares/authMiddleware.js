const jwt= require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.render('login', { error: 'Acceso denegado. Inicia sesión.' });
    }

    try {
        const decoded = jwt.verify(token, 'clave_secreta');
        req.user = decoded;
        next();
    } catch (err) {
        res.render('login', { error: 'Token inválido. Inicia sesión nuevamente.' });
    }
};
