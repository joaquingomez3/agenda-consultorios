
const Paciente = require('../models/modeloPaciente');

exports.listarPacientes = (req, res) => {
    Paciente.getAll((err, results) => {
        if (err) throw new Error('Error al listar pacientes');
        res.render('pacientes/listarPacientes', { pacientes: results, usuario: req.user, formatearFecha });
    });
};

exports.vistaPaciente = (req, res) => {
    res.render('pacientes/crearPaciente', { usuario: req.user });
};

exports.crearPaciente = (req, res) => {
    const { nombre, dni, fechaNacimiento, sexo, obraSocial, contacto } = req.body;
    const errores = [];

    if (!nombre || nombre.trim().length === 0) errores.push('El nombre es obligatorio.');
    if (!dni || !/^\d{7,8}$/.test(dni)) errores.push('El DNI debe tener entre 7 y 8 números.');
    if (!obraSocial || obraSocial.trim().length === 0) errores.push('La obra social es obligatoria.');
    if (!contacto || !/^\d{7,15}$/.test(contacto)) errores.push('El teléfono debe tener entre 7 y 15 dígitos.');

    if (errores.length > 0) {
        return res.render('pacientes/crearPaciente', {
            errores,
            paciente: { nombre, dni, obraSocial, contacto }
        });
    }

    Paciente.create(nombre, dni, fechaNacimiento, sexo, obraSocial, contacto, (err, results) => {
        if (err) {
            console.error('Error al crear paciente:', err); 
            return res.status(500).send('Ocurrió un error al crear el paciente');
        }
        
        
        Paciente.getAll((err, results) => {
            if (err) throw new Error('Error al listar pacientes');
            res.redirect('/pacientes/?creado=1');
        });
    });
};

exports.editarPaciente = (req, res) => {
    const id = req.params.id;
    
    Paciente.getById(id, (err, paciente) => {
        if (err) throw new Error('Error al obtener los datos del paciente');
        if (!paciente) {
            return res.send('Paciente no encontrado');
        }
        res.render('pacientes/editarPaciente', { paciente, usuario: req.user, formatearFecha });
    });
};


exports.actualizarPaciente = (req, res) => {
    const { id, nombre, dni, fechaNacimiento, sexo, obraSocial, contacto } = req.body;
    const errores = [];

    if (!nombre || nombre.trim().length === 0) errores.push('El nombre es obligatorio.');
    if (!dni || !/^\d{7,8}$/.test(dni)) errores.push('El DNI debe tener entre 7 y 8 números.');
    if (!obraSocial || obraSocial.trim().length === 0) errores.push('La obra social es obligatoria.');
    if (!contacto || !/^\d{7,15}$/.test(contacto)) errores.push('El teléfono debe tener entre 7 y 15 dígitos.');

    if (errores.length > 0) {
        // Para renderizar de nuevo el formulario con los datos y errores
        return res.render('pacientes/editarPaciente', {
            errores,
            paciente: {
                id,
                nombre_completo: nombre,
                dni,
                motivo_consulta: motivoConsulta,
                obra_social: obraSocial,
                datos_contacto: contacto
            }
        });
    }

    Paciente.update(id, nombre, dni, fechaNacimiento, sexo, obraSocial, contacto, (err, results) => {
        if (err) throw new Error('Error al actualizar paciente');
        
        Paciente.getAll((err, results) => {
            if (err) throw new Error('Error al listar pacientes');
            res.redirect('/pacientes/?actualizado=1');

        });
    });
};
function formatearFecha(fechaStr) {
    
    const fecha = new Date(fechaStr);

    
    const dia = fecha.getDate().toString().padStart(2, '0'); 
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); 
    const anio = fecha.getFullYear();

    
    return `${dia}-${mes}-${anio}`;
}