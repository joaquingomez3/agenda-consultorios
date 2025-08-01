// models/Paciente.js
const connection = require('../config/baseDatos');

const Paciente = {};

// Listar pacientes
Paciente.getAll = (callback) => {
    connection.query('SELECT * FROM paciente', (err, results) => {
        callback(err, results);
    });
};

Paciente.crearParaUsuario = (nombre, dni, obraSocial, contacto, callback) => {
    connection.query(
        'INSERT INTO paciente (nombre_completo, dni, obra_social, datos_contacto) VALUES (?, ?, ?, ?)', 
        [nombre, dni, obraSocial, contacto], 
        (err, results) => {
            callback(err, results);
        }
    );
};

Paciente.create = (nombre, dni, fechaNacimiento, sexo,  obraSocial, contacto, callback) => {
    connection.query(
        'INSERT INTO paciente (nombre_completo, dni, fecha_nacimiento, sexo, obra_social, datos_contacto) VALUES (?, ?, ?, ?, ?, ?)', 
        [nombre, dni, fechaNacimiento, sexo, obraSocial, contacto], 
        (err, results) => {
            callback(err, results);
        }
    );
};

Paciente.obtenerPorDni = (dni, callback) => {
    connection.query('SELECT * FROM paciente WHERE dni = ?', [dni], (err, results) => {
        callback(err, results[0]);
    });
};
// Obtener paciente por ID
Paciente.getById = (id, callback) => {
    connection.query('SELECT * FROM paciente WHERE id = ?', [id], (err, results) => {
        callback(err, results[0]);
    });
};

// Actualizar paciente
Paciente.update = (id, nombre, dni, fechaNacimiento, sexo, obraSocial, contacto, callback) => {
    connection.query(
        'UPDATE paciente SET nombre_completo = ?, dni = ?, fecha_nacimiento = ?, sexo = ?, obra_social = ?, datos_contacto = ? WHERE id = ?', 
        [nombre, dni, fechaNacimiento, sexo, obraSocial, contacto, id], 
        (err, results) => {
            callback(err, results);
        }
    );
};

Paciente.editar = (nombre, dni, obraSocial, tel, callback) => {
    connection.query(
        'UPDATE paciente SET nombre_completo = ?, obra_social = ?, datos_contacto = ? WHERE dni = ?', 
        [nombre, obraSocial, tel, dni], 
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

Paciente.buscarPorNombreODni = (query, callback) => {
    connection.query(
        'SELECT id, nombre_completo, dni FROM paciente WHERE nombre_completo LIKE ? OR dni LIKE ? LIMIT 10',
        [`%${query}%`, `%${query}%`],
        (err, results) => {
            callback(err, results);
            
        }
        
    );
};

module.exports = Paciente;
