const connection = require('../config/baseDatos');

const Feriados = {};

// Listar feriados
Feriados.getAll = (callback) => {
    connection.query('SELECT * FROM diasnolaborables', (err, results) => {
        callback(err, results);
    });
};

Feriados.crear = (dia, mes, descripcion, callback) => {
    connection.query(
        'INSERT INTO diasnolaborables (dia, mes, descripcion) VALUES (?, ?, ?)',
        [dia, mes, descripcion],
        (err, results) => {
            callback(err, results);
        }
    );
};


module.exports = Feriados;

