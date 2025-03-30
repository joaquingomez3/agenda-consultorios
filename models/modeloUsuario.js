const connection = require('../config/baseDatos');

const Usuario = {};
Usuario.create = (nombre_usuario, contrasenia, rol, callback) => {
    connection.query('INSERT INTO usuario (nombre_usuario, contrasenia, rol) VALUES (?, ?, ?)', [nombre_usuario, contrasenia, rol], (err, results) => {
        callback(err, results);
    });
};

module.exports = Usuario;