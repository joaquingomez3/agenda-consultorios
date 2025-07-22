const connection = require('../config/baseDatos');

const Feriados = {};

// Listar feriados
Feriados.getAll = (callback) => {
    connection.query('SELECT * FROM diasnolaborables', (err, results) => {
        callback(err, results);
    });
};

Feriados.crear = (fecha, descripcion, callback) => {
    
    connection.query('INSERT INTO diasnolaborables (fecha, descripcion) VALUES (?, ?)', [fecha, descripcion], (err, results) => {
        callback(err, results);
    });
};

module.exports = Feriados;

