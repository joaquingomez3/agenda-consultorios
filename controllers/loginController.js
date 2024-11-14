exports.mostrarLogin = (req, res) => {
    res.render('login');
}

// Ruta para manejar el envío del formulario de login
exports.procesarLogin = (req, res) => {
    const { username, password } = req.body;

    // Validar las credenciales
    if (username === 'admin' && password === '1'||username === 'secretaria1' && password === 'secret123' ) {
        // Redirigir a la página principal después de un inicio de sesión exitoso
        res.redirect('/inicio');
    } else {
        // Si las credenciales son incorrectas, puedes redirigir de nuevo al login
        res.render('login', { error: 'Usuario o contraseña incorrectos' });
    }
}