const connection = require('../config/baseDatos');

const Usuario = {};
Usuario.create = (dni, nombre_usuario, contrasenia, rol, callback) => {
    connection.query('INSERT INTO usuario (dni, nombre_usuario, contrasenia, rol) VALUES (?, ?, ?, ?)', [dni, nombre_usuario, contrasenia, rol], (err, results) => {
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
Usuario.buscarPorId = (dni, callback) => {
   connection.query('SELECT * FROM usuario WHERE dni = ?', [dni], (err, results) => {
        callback(err, results[0]);
    });
};

Usuario.editar = (dni, nombre_usuario, callback) => {
    connection.query('UPDATE usuario SET nombre_usuario = ?  WHERE dni = ?', [nombre_usuario, dni], (err, results) => {
        callback(err, results);
    });
}
module.exports = Usuario;