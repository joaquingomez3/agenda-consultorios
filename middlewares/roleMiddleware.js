const jwt = require('jsonwebtoken');

const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        const token = req.cookies.jwt;

        if (!token) {
            return res.redirect('/login');
        }

        try {
            const usuario = jwt.verify(token, 'clave_secreta');
            req.usuario = usuario; // Guarda los datos del usuario en la request

            if (!rolesPermitidos.includes(usuario.rol)) {
                return res.status(403).render('error', { mensaje: 'No tienes permiso para acceder a esta página.' });
            }

            next();
        } catch (error) {
            return res.redirect('/login');
        }
    };
};

module.exports = verificarRol;
