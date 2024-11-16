const bcript = require('bcrypt');
const connection = require('../config/baseDatos');
exports.mostrarLogin = (req, res) => {
    res.render('login');
}

// Ruta para manejar el envío del formulario de login
exports.procesarLogin = (req, res) => {
    const { username, password } = req.body;
    
    connection.query('SELECT * FROM usuario WHERE nombre_usuario = ? ', [username], async (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }
        if (results.length === 0) {
            res.render('login', { error: 'Usuario o contraseña incorrectos' });
        }
        console.log(results[0]);
        const coincide = await bcript.compare(password, results[0].contrasenia);
        if (!coincide) {
            res.render('login', { error: 'contraseña incorrecta' });
        } 
        //firmar un jwt con id , nombre , rol de usuario y lo guardo en una cokie
        res.redirect('/inicio');
    })
    // Validar las credenciales
    // if (username === 'admin' && password === '1'||username === 'secretaria1' && password === 'secret123' ) {

    //     // Redirigir a la página principal después de un inicio de sesión exitoso
    //     res.redirect('/inicio');
    // } else {
    //     // Si las credenciales son incorrectas, puedes redirigir de nuevo al login
    //     res.render('login', { error: 'Usuario o contraseña incorrectos' });
    // }
}