// controllers/pacientesController.js
const Paciente = require('../models/modeloPaciente');

exports.listarPacientes = (req, res) => {
    Paciente.getAll((err, results) => {
        if (err) throw new Error('Error al listar pacientes');
        res.render('pacientes/listarPacientes', { pacientes: results });
    });
};

exports.vistaPaciente = (req, res) => {
    res.render('pacientes/crearPaciente');
};

exports.crearPaciente = (req, res) => {
    const { nombre, dni, motivoConsulta, obraSocial, contacto } = req.body;

    // Validaciones
    if (!nombre || !dni || !obraSocial || !contacto) {
        throw new Error('Todos los campos obligatorios excepto motivo de consulta');
    }

    Paciente.create(nombre, dni, motivoConsulta, obraSocial, contacto, (err, results) => {
        if (err) throw new Error('Error al crear paciente');
        
        Paciente.getAll((err, results) => {
            if (err) throw new Error('Error al listar pacientes');
            res.render('pacientes/listarPacientes', { pacientes: results, mensaje: `Se agregó el paciente ${nombre} exitosamente` });
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
        res.render('pacientes/editarPaciente', { paciente });
    });
};


exports.actualizarPaciente = (req, res) => {
    const { id, nombre, dni, motivoConsulta, obraSocial, contacto } = req.body;

    Paciente.update(id, nombre, dni, motivoConsulta, obraSocial, contacto, (err, results) => {
        if (err) throw new Error('Error al actualizar paciente');
        
        Paciente.getAll((err, results) => {
            if (err) throw new Error('Error al listar pacientes');
            res.render('pacientes/listarPacientes', { pacientes: results, mensaje: `El paciente ${nombre} fue actualizado exitosamente` });
        });
    });
};
