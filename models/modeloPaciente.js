// models/Paciente.js
const connection = require('../config/baseDatos');

const Paciente = {};

// Listar pacientes
Paciente.getAll = (callback) => {
    connection.query('SELECT * FROM paciente', (err, results) => {
        callback(err, results);
    });
};

// Crear paciente
Paciente.create = (nombre, dni, motivoConsulta, obraSocial, contacto, callback) => {
    connection.query(
        'INSERT INTO paciente (nombre_completo, dni, motivo_consulta, obra_social, contacto) VALUES (?, ?, ?, ?, ?)', 
        [nombre, dni, motivoConsulta, obraSocial, contacto], 
        (err, results) => {
            callback(err, results);
        }
    );
};

// Obtener paciente por ID
Paciente.getById = (id, callback) => {
    connection.query('SELECT * FROM paciente WHERE id = ?', [id], (err, results) => {
        callback(err, results[0]);
    });
};

// Actualizar paciente
Paciente.update = (id, nombre, dni, motivoConsulta, obraSocial, contacto, callback) => {
    connection.query(
        'UPDATE paciente SET nombre_completo = ?, dni = ?, motivo_consulta = ?, obra_social = ?, contacto = ? WHERE id = ?', 
        [nombre, dni, motivoConsulta, obraSocial, contacto, id], 
        (err, results) => {
            callback(err, results);
        }
    );
};



// Buscar paciente por DNI o nombre
Paciente.buscarPacientePorDniONombre = async (dni, nombre) => {
    const [result] = await db.query(
      'SELECT id FROM paciente WHERE dni = ? OR nombre = ?',
      [dni, nombre]
    );
    return result.length > 0 ? result[0].id : null;
  };



module.exports = Paciente;
