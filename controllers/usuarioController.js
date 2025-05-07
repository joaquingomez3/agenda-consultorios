const Usuario = require('../models/modeloUsuario');
const bcrypt = require('bcrypt');
exports.mostrarFormulario = (req, res) => {
    res.render('usuarios/crear');
};

exports.crearUsuario = async (req, res) => {
    try {
        const { nombre_usuario, contrasenia, nuevaContrasenia } = req.body;
        const errores = [];
        const rol = 'usuario';

        // aca verificamos que los campos no esten vacios
        if (!nombre_usuario || !contrasenia || !nuevaContrasenia) {
            errores.push('Todos los campos son obligatorios');
        }

        // verificamos que el nombre de usuario no tenga espacios
        if (/\s/.test(nombre_usuario)) {
            errores.push('El nombre de usuario no debe contener espacios');
        }

        // verificamos que la contrasenia tenga al menos 8 caracteres
        if (contrasenia.length < 8) {
            errores.push('La contraseña debe tener al menos 8 caracteres');
        }

        if (contrasenia !== nuevaContrasenia) {
            errores.push('Las contraseñas no coinciden');
        }

        // verificamos que el usuario no exista
        const usuarioExistente = await Usuario.buscarPorNombre(nombre_usuario);
        if (usuarioExistente) {
            errores.push('El nombre de usuario ya existe');
        }

        if (errores.length > 0) {
            return res.render('usuarios/crear', {
                errores,
                nombre_usuario,
                rol
            });
        }

        const contraseniaHash = await bcrypt.hash(contrasenia, 10);
        Usuario.create(nombre_usuario, contraseniaHash, rol, (err, results) => {
            if (err) {
                console.error('Error al crear usuario:', err);
                return res.render('usuarios/crear', {
                    errores: ['Error al crear usuario']
                });
            }
            res.redirect('/?success=Usuario creado exitosamente');
        });

    } catch (error) {
        console.error('Error general:', error);
        res.render('usuarios/crear', { errores: ['Ocurrió un error inesperado'] });
    }
};