const connection = require('../config/baseDatos');
const moment = require('moment');


const Agenda = {
    listarAgendas(callback) {
        connection.query(`SELECT 
                            a.id,
                            a.dias,
                            a.horaInicio,
                            a.horaFin,
                            a.duracion,
                            a.fechaCreacion,
                            a.clasificacion,
                            a.sobreturnos,
                            s.nombre AS nombre_sucursal,
                            d.nombre_completo,
                            e.nombre AS nombre_especialidad
                            FROM 
                                agenda a
                            JOIN 
                                sucursal s ON a.id_sucursal = s.id
                            JOIN 
                                doctores_especialidad de on a.matricula = de.matricula
                            JOIN 
                                doctores d ON de.id_doctor = d.id
                            JOIN 
                                especialidad e ON de.id_especialidad = e.id`, callback);
                                    },

    obtenerAgendaPorId(id, callback) {
        connection.query('SELECT * FROM agenda WHERE id = ?', [id], callback);
    },

    obtenerSucursales(callback) {
        connection.query('SELECT id, nombre FROM sucursal', callback);
    },

    crearAgenda(agenda, callback) {
        const {
            id_sucursal,
            matricula,
            clasificacion,
            sobreturnos,
            dias,
            horainicio,
            horaFin,
            duracion,
            fechaCreacion,
            id_doctor
        } = agenda;
    
        connection.query(
            `INSERT INTO agenda 
            (id_sucursal, matricula, clasificacion, sobreturnos, dias, horainicio, horaFin, duracion, fechaCreacion, id_doctor) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id_sucursal, matricula, clasificacion, sobreturnos, dias, horainicio, horaFin, duracion, fechaCreacion, id_doctor],
            callback
        );
    },
    

    actualizarAgenda(id, { id_sucursal, clasificacion, max_sobreturnos, doctor_especialidad_id }, callback) {
        connection.query(
            'UPDATE agenda SET id_sucursal = ?, clasificacion = ?, max_sobreturnos = ?, doctor_especialidad_id = ? WHERE id = ?',
            [id_sucursal, clasificacion, max_sobreturnos, doctor_especialidad_id, id],
            callback
        );
    },

    verTurnosAgenda(id, callback) {
        const hoy = moment().format('YYYY-MM-DD'); // Fecha actual en formato YYYY-MM-DD
        
        connection.query(`SELECT t.id AS turno_id,
       p.nombre_completo AS paciente_nombre,
       t.fechaTurno,
       t.inicio,
       t.fin,
       e.nombre_estado AS estado_turno,
       t.motivo,
       d.nombre_completo AS doctor_nombre,  -- Nombre del doctor en lugar de la matrícula
       a.dias,
       a.horaInicio AS agenda_horaInicio,
       a.horaFin AS agenda_horaFin,
       a.duracion,
       a.clasificacion,
       a.sobreturnos
       FROM turno t
       JOIN agenda a ON t.id_agenda = a.id
       LEFT JOIN paciente p ON t.id_paciente = p.id
       JOIN estadoturno e ON t.estado_turno = e.id
       JOIN doctores_especialidad de ON a.matricula = de.matricula  
       JOIN doctores d ON de.id_doctor = d.id 
       WHERE a.id = ? AND t.fechaTurno = ? ` , [id, hoy], callback); 
    },

    crearTurnosDiarios(id,callback) {
        let inicio;
        let fin;
        let duracion;
        if (id == 1) {
            
            inicio = moment().startOf('day').add(7, 'hours'); // 7 AM
            fin = moment().startOf('day').add(12, 'hours'); // 12 PM
            duracion = 30; // Duración de cada turno en minutos
        } else if (id == 2) {
            
            inicio = moment().startOf('day').add(14, 'hours'); // 14 PM
            fin = moment().startOf('day').add(20, 'hours'); // 20 PM
            duracion = 30;
        } else if (id == 3) {
            
            inicio = moment().startOf('day').add(7, 'hours'); // 7 AM
            fin = moment().startOf('day').add(12, 'hours'); // 8 PM
            duracion = 30;
        } else {
            // Maneja el caso en que `id` no sea 1, 2 o 3
            return callback(new Error('ID de agenda no válido'));
        }

        const turnos = [];
        for (let m = inicio.clone(); m.isBefore(fin); m.add(duracion, 'minutes')) {
            turnos.push([
                id, // id_agenda
                m.format('YYYY-MM-DD'), // fechaTurno
                m.format('HH:mm:ss'), // inicio
                m.clone().add(duracion, 'minutes').format('HH:mm:ss'), // fin
                2 // estado_turno (Libre)
            ]);
        }
        
        // Inserta turnos y elimina turnos anteriores a hoy para esta agenda
        connection.query(
            'INSERT INTO turno (id_agenda, fechaTurno, inicio, fin, estado_turno) VALUES ?',
            [turnos],
            (insertErr, insertResults) => {
                if (insertErr) return callback(insertErr);

                const hoy = moment().format('YYYY-MM-DD');
                connection.query(
                    'DELETE FROM turno WHERE fechaTurno < ? AND id_agenda = ?',
                    [hoy, id],
                    callback
                );
            }
        );
    },

    asignarPacienteATurno(turno_id, paciente_id, motivo, callback) {
        
        connection.query(
            'UPDATE turno SET id_paciente = ?, estado_turno = 3, motivo = ? WHERE id = ?',
            [paciente_id, motivo, turno_id],
            callback
        );
    },
    // En AgendaModel.js
    obtenerIdAgendaPorTurno (turno_id, callback) {
        const query = 'SELECT id_agenda FROM turno WHERE id = ?';
        connection.query(query, [turno_id], (err, results) => {
            if (err) {
                return callback(err);
            }
            // Retorna el primer resultado de la agenda_id
            callback(null, results[0]?.id_agenda);
    });
}

    
};
module.exports = Agenda;

