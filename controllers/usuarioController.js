const Usuario = require('../models/modeloUsuario');
const bcrypt = require('bcrypt');
exports.mostrarFormulario = (req, res) => {
    res.render('usuarios/crear');
};

exports.crearUsuario = async (req, res) => {
    try{
    const { nombre_usuario, contrasenia, rol } = req.body;
    
    // Validaciones
    if (!nombre_usuario || !contrasenia || !rol) {
        throw new Error('Todos los campos son obligatorios');
    }
    

    const contraseniahash = await bcrypt.hash(contrasenia, 10);

    Usuario.create(nombre_usuario, contraseniahash, rol, (err, results) => {
        if (err) throw new Error('Error al crear usuario');
        res.redirect('/?success=Usuario creado exitosamente');
    });


    } catch (error) {
        console.error('Error general:', error);
        res.render('usuarios/crear', { error: 'Ocurrió un error inesperado' });
    }
};