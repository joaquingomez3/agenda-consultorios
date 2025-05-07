const connection = require('../config/baseDatos');

const Usuario = {};
Usuario.create = (nombre_usuario, contrasenia, rol, callback) => {
    connection.query('INSERT INTO usuario (nombre_usuario, contrasenia, rol) VALUES (?, ?, ?)', [nombre_usuario, contrasenia, rol], (err, results) => {
        callback(err, results);
    });
};

Usuario.buscarPorNombre = (nombre_usuario, callback) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM usuario WHERE nombre_usuario = ?';
        connection.query(query, [nombre_usuario], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0 ? results[0] : null);
        });
    });
};

module.exports = Usuario;