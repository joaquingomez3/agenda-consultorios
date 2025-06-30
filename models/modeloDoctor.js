
const connection = require('../config/baseDatos');

const Doctor = {};

// Listar doctores
Doctor.getAll = (callback) => {
    connection.query('SELECT * FROM doctores', (err, results) => {
        callback(err, results);
    });
};

// Listar doctores activos
Doctor.obtenerDoctores = (callback) => {
    connection.query('SELECT de.matricula, d.nombre_completo FROM doctores_especialidad de JOIN doctores d ON de.id_doctor = d.id', (err, results) => {
        callback(err, results);
    });
};

// Crear doctor
Doctor.create = (nombre, telefono, dni, mail, domicilio, callback) => {
    connection.query('INSERT INTO doctores (nombre_completo, telefono, dni, mail, domicilio) VALUES (?, ?, ?, ?, ?)', [nombre, telefono, dni, mail, domicilio], (err, results) => {
        callback(err, results);
    });
};

// Obtener doctor por ID
Doctor.getById = (id, callback) => {
    connection.query('SELECT * FROM doctores WHERE id = ?', [id], (err, results) => {
        callback(err, results[0]);
    });
};

// Actualizar doctor
Doctor.update = (id, nombre, telefono, dni, mail, domicilio, callback) => {
    connection.query('UPDATE doctores SET nombre_completo = ?, telefono = ?, dni = ?, mail = ?, domicilio = ? WHERE id = ?', [nombre, telefono, dni, mail, domicilio, id], (err, results) => {
        callback(err, results);
    });
};

// Cambiar estado de doctor
Doctor.changeStatus = (id, activo, callback) => {
    connection.query('UPDATE doctores SET activo = ? WHERE id = ?', [activo, id], (err, results) => {
        callback(err, results);
    });
};

Doctor.getAllEspecialidades = (callback) => {
    connection.query('SELECT * FROM especialidad', (err, results) => {
        callback(err, results);
    });
};

Doctor.getEspecialidadesByDoctor = (doctorId, callback) => {
    const query = `
        SELECT e.id, e.nombre 
        FROM especialidad e
        JOIN doctores_especialidad de ON e.id = de.id_especialidad
        WHERE de.id_doctor = ?
    `;
    connection.query(query, [doctorId], (err, results) => {
        callback(err, results);
    });
};

// Asignar una especialidad a un doctor
Doctor.addEspecialidadToDoctor = (doctorId, especialidadId, callback) => {
    const query = 'INSERT INTO doctores_especialidad (id_doctor, id_especialidad) VALUES (?, ?)';
    connection.query(query, [doctorId, especialidadId], (err, result) => {
        callback(err, result);
    });
};

// Eliminar una especialidad de un doctor
Doctor.removeEspecialidadFromDoctor = (doctorId, especialidadId, callback) => {
    const query = 'DELETE FROM doctores_especialidad WHERE id_doctor = ? AND id_especialidad = ?';
    connection.query(query, [doctorId, especialidadId], (err, result) => {
        callback(err, result);
    });
};
// Obtener doctores con especialidades y matrículas
Doctor.getDoctoresConEspecialidades = (callback) => {
    const query = `
        SELECT 
    d.id,
    d.nombre_completo,
    d.telefono,
    d.dni,
    d.mail,
    d.domicilio,
    GROUP_CONCAT(DISTINCT de.matricula) AS matricula,
    GROUP_CONCAT(DISTINCT e.nombre SEPARATOR ', ') AS especialidad,
    d.activo
FROM doctores d
LEFT JOIN doctores_especialidad de ON d.id = de.id_doctor
LEFT JOIN especialidad e ON de.id_especialidad = e.id
GROUP BY d.id;

    `;
    connection.query(query, (err, results) => {
        callback(err, results);
    });
};

module.exports = Doctor;
