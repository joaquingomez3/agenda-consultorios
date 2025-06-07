const Usuario = require('../models/modeloUsuario');
const Paciente = require('../models/modeloPaciente');
const bcrypt = require('bcrypt');
exports.mostrarFormulario = (req, res) => {
    res.render('usuarios/crear');
};

exports.crearUsuario = async (req, res) => {
    try {
        const {nombre, dni, obraSocial, tel, nombre_usuario, contrasenia, nuevaContrasenia } = req.body;
        const errores = [];
        const rol = 'usuario';

        // aca verificamos que los campos no esten vacios
        if (!nombre_usuario || !contrasenia || !nuevaContrasenia || !nombre || !dni || !obraSocial || !tel) {
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
        Paciente.crearParaUsuario(nombre, dni, obraSocial, tel, (err, results) => {
            if (err) {
                console.error('Error al crear paciente:', err);
                return res.render('usuarios/crear', {
                    errores: ['Error al crear paciente']
                });
            }
        });
        Usuario.create(dni, nombre_usuario, contraseniaHash, rol, (err, results) => {
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

exports.mostrarFormularioEditar = (req, res) => {
    const dni = req.params.dni;
    

    Paciente.obtenerPorDni(dni, (err, paciente) => {
        if (err) {
            console.error('Error al obtener los datos del paciente:', err);
            return res.render('usuarios/editar', { errores: ['Error al obtener los datos del paciente'] });
        }
        if (!paciente) {
            return res.render('usuarios/editar', { errores: ['Paciente no encontrado'] });
        }

        Usuario.buscarPorId(dni, (err, usuario) => {
            if (err) {
                console.error('Error al buscar usuario:', err);
                return res.render('usuarios/editar', { errores: ['Error al buscar usuario'] });
            }
            if (!usuario) {
                return res.render('usuarios/editar', { errores: ['Usuario no encontrado'] });
            }

            
            res.render('usuarios/perfil', { usuario, paciente });
        });
    });
};

exports.editarUsuario = (req, res) => {
    const nombre_usuario = req.body.nombreUsuario;
    
    const { nombre, dni, obraSocial, tel } = req.body;
console.log(nombre_usuario, dni, nombre, obraSocial, tel);
    Paciente.editar(nombre, dni, obraSocial, tel, (err, results) => {
        if (err) {
            console.error('Error al editar paciente:', err);
            return res.render('usuarios/editar', { errores: ['Error al editar paciente'] });
        }
    });

    Usuario.editar(dni, nombre_usuario, (err, results) => {
        if (err) {
            console.error('Error al editar usuario:', err);
            return res.render('usuarios/editar', { errores: ['Error al editar usuario'] });
        }
        res.redirect('/inicio');
    });

}