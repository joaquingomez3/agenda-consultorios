
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../config/baseDatos');

exports.mostrarLogin = (req, res) => {
    const successMessage = req.query.success; 
    res.render('login', { success: successMessage });
};

exports.procesarLogin = (req, res) => {
    const { username, password } = req.body;

    connection.query('SELECT * FROM usuario WHERE nombre_usuario = ?', [username], async (err, results) => {
        if (err) {
            console.error('Error en la base de datos:', err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (results.length === 0) {
            return res.render('login', { error: 'Datos Incorrectos' });
        }

        const usuario = results[0];
        const coincide = await bcrypt.compare(password, usuario.contrasenia);

        if (!coincide) {
            return res.render('login', { error: 'Datos Incorrectos' });
        }
        
        // Generar el token JWT
        const token = jwt.sign({ dni: usuario.dni, username: usuario.nombre_usuario, rol: usuario.rol }, 'clave_secreta', { expiresIn: '1h' });
        
        // Guardar el token en una cookie
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });

        res.redirect('/inicio' );
    });
};
