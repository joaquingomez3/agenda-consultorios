
const Doctor = require('../models/modeloDoctor');

exports.listarDoctores = (req, res) => {
    Doctor.getDoctoresConEspecialidades((err, results) => {
        if (err) throw new Error('Error al listar doctores');
        res.render('doctores/listarDoctores', { doctores: results, usuario: req.user });
    });
};


exports.vistaDoctor = (req, res) => {
    res.render('doctores/crearDoctores');
};

exports.crearDoctor = (req, res) => {
    const {nombre, telefono, dni, mail, domicilio} = req.body;

    const errores = [];

    if (!nombre || nombre.trim().length === 0) errores.push('El nombre es obligatorio.');
    if (!telefono || !/^\d{7,15}$/.test(telefono)) errores.push('El teléfono debe tener entre 7 y 15 dígitos.');
    if (!dni || !/^\d{7,8}$/.test(dni)) errores.push('El DNI debe tener entre 7 y 8 números.');
    if (!mail || mail.trim().length === 0) errores.push('El mail es obligatorio.');
    

    if (errores.length > 0) {
        return res.render('doctores/crearDoctores', {
            errores,
            doctores: { nombre, telefono, dni, mail, domicilio }
        });
    }
    

    Doctor.create(nombre, telefono, dni, mail, domicilio, (err, results) => {
        if (err) throw new Error('Error al crear doctor');

        
        Doctor.getAll((err, results) => {
            if (err) throw new Error('Error al listar doctores');
            res.render('doctores/listarDoctores', { doctores: results, mensaje: `Se agregó el doctor ${nombre} exitosamente` });
        });
    });
};

exports.editarDoctor = (req, res) => {
    const id = req.params.id;

    Doctor.getById(id, (err, doctor) => {
        if (err) throw new Error('Error al obtener los datos del doctor');
        if (!doctor) {
            return res.send('Doctor no encontrado');
        }
        res.render('doctores/editarDoctores', { doctor });
    });
};

exports.cambiarEstadoDoctor = (req, res) => {
    const id = req.params.id;
    const { activo } = req.body;

    Doctor.changeStatus(id, activo, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el estado del doctor' });
        res.status(200).json({ exito: true });

    });
};

exports.actualizarDoctor = (req, res) => {
    const { id, nombre, telefono, dni, mail, domicilio } = req.body;
    const errores = [];

    if (!nombre || nombre.trim().length === 0) errores.push('El nombre es obligatorio.');
    if (!telefono || !/^\d{7,15}$/.test(telefono)) errores.push('El teléfono debe tener entre 7 y 15 dígitos.');
    if (!dni || !/^\d{7,8}$/.test(dni)) errores.push('El DNI debe tener entre 7 y 8 números.');
    if (!mail|| mail.trim().length === 0) errores.push('el mail es obligatorio.');
    if (!domicilio || domicilio.trim().length === 0) errores.push('El domicilio es obligatorio.');
    

    if (errores.length > 0) {
        // Para renderizar de nuevo el formulario con los datos y errores
        return res.render('doctores/editarDoctores', {
            errores,
            doctor: {
                id,
                nombre_completo: nombre,
                telefono,
                dni,
                mail,
                domicilio
            }
        });
    }

    Doctor.update(id, nombre, telefono, dni, mail, domicilio, (err, results) => {
        if (err) throw new Error('Error al actualizar doctor');
        
        Doctor.getAll((err, results) => {
            if (err) throw new Error('Error al listar doctores');
            res.render('doctores/listarDoctores', { doctores: results, mensaje: `El doctor ${nombre} fue actualizado exitosamente` });
        });
    });
};
// Listar especialidades de un doctor
exports.listarEspecialidadesDeDoctor = (req, res) => {
    const doctorId = req.params.id;
    
    // Obtener especialidades del doctor
    Doctor.getEspecialidadesByDoctor(doctorId, (err, especialidades) => {
        if (err) throw new Error('Error al obtener especialidades del doctor');
        
        // Aquí debes obtener todas las especialidades disponibles para el select
        Doctor.getAllEspecialidades((err, todasLasEspecialidades) => {
            if (err) throw new Error('Error al obtener todas las especialidades');

            // Renderiza la vista pasando las especialidades y todas las especialidades
            res.render('doctores/gestionarEspecialidades', { especialidades, todasLasEspecialidades, doctorId });
        });
    });
};


// Asignar especialidad a un doctor
exports.asignarEspecialidad = (req, res) => {
    const { doctorId, especialidadId } = req.body;
    Doctor.addEspecialidadToDoctor(doctorId, especialidadId, (err) => {
        if (err) throw new Error('Error al asignar especialidad');
        
        res.redirect(`/doctores/${doctorId}/especialidades`);
    });
};

// Eliminar especialidad de un doctor
exports.eliminarEspecialidad = (req, res) => {
    const { doctorId, especialidadId } = req.params;
    Doctor.removeEspecialidadFromDoctor(doctorId, especialidadId, (err) => {
        if (err) throw new Error('Error al eliminar especialidad');
        
        res.redirect(`/doctores/${doctorId}/especialidades`);
    });
};
