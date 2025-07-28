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
        (err, result) => {
            if (err) return callback(err);
            callback(null, result.insertId); 
        }
    );
    },
    

    actualizarAgenda(id, { id_sucursal, clasificacion, max_sobreturnos }, callback) {
        connection.query(
            'UPDATE agenda SET id_sucursal = ?, clasificacion = ?, sobreturnos = ? WHERE id = ?',
            [id_sucursal, clasificacion, max_sobreturnos, id],
            callback
        );
    },

    // verTurnosAgenda(id,  callback) {
    //     const hoy = moment().format('YYYY-MM-DD'); // Fecha actual en formato YYYY-MM-DD
        
    //     connection.query(`SELECT t.id AS turno_id,
    //    p.nombre_completo AS paciente_nombre,
    //    t.fechaTurno,
    //    t.inicio,
    //    t.fin,
    //    e.nombre_estado AS estado_turno,
    //    t.motivo,
    //    d.nombre_completo AS doctor_nombre,  -- Nombre del doctor en lugar de la matrícula
    //    a.dias,
    //    a.horaInicio AS agenda_horaInicio,
    //    a.horaFin AS agenda_horaFin,
    //    a.duracion,
    //    a.clasificacion,
    //    a.sobreturnos
    //    FROM turno t
    //    JOIN agenda a ON t.id_agenda = a.id
    //    LEFT JOIN paciente p ON t.id_paciente = p.id
    //    JOIN estadoturno e ON t.estado_turno = e.id
    //    JOIN doctores_especialidad de ON a.matricula = de.matricula  
    //    JOIN doctores d ON de.id_doctor = d.id 
    //    WHERE a.id = ? AND t.fechaTurno = ? ` , [id, hoy], callback); 
    // },
verTurnosAgenda(id, fecha, callback) {
    connection.query(`
        SELECT t.id AS turno_id,
               p.nombre_completo AS paciente_nombre,
               t.fechaTurno,
               t.inicio,
               t.fin,
               e.nombre_estado AS estado_turno,
               t.motivo,
               d.nombre_completo AS doctor_nombre,
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
        WHERE a.id = ? AND t.fechaTurno = ?`, [id, fecha], callback);
},


// insertarTurnos(id, fechaSeleccionada, callback) {
//     let inicio;
//     let fin;
//     let duracion = 30;

//     // Verifica si ya existen turnos para esa fecha y agenda
//     connection.query(
//         'SELECT COUNT(*) AS cantidad FROM turno WHERE fechaTurno = ? AND id_agenda = ?',
//         [fechaSeleccionada, id],
//         (err, results) => {
//             if (err) return callback(err);

//             if (results[0].cantidad === 0) {
//                 // Definir rangos según la agenda
//                 if (id == 1) {
//                     inicio = moment(fechaSeleccionada + ' 07:00');
//                     fin = moment(fechaSeleccionada + ' 12:00');
//                 } else if (id == 2) {
//                     inicio = moment(fechaSeleccionada + ' 14:00');
//                     fin = moment(fechaSeleccionada + ' 20:00');
//                 } else if (id == 3) {
//                     inicio = moment(fechaSeleccionada + ' 07:00');
//                     fin = moment(fechaSeleccionada + ' 12:00');
//                 } else {
//                     return callback(new Error('ID de agenda no válido'));
//                 }

//                 const turnos = [];
//                 for (let m = inicio.clone(); m.isBefore(fin); m.add(duracion, 'minutes')) {
//                     turnos.push([
//                         id,
//                         fechaSeleccionada,
//                         m.format('HH:mm:ss'),
//                         m.clone().add(duracion, 'minutes').format('HH:mm:ss'),
//                         2 // Estado: 2 = Libre
//                     ]);
//                 }
//                 console.log(turnos);
//                 // Insertar nuevos turnos
//                 connection.query(
//                     'INSERT INTO turno (id_agenda, fechaTurno, inicio, fin, estado_turno) VALUES ?',
//                     [turnos],
//                     (insertErr, insertResults) => {
//                         if (insertErr) return callback(insertErr);

//                         // Limpiar turnos anteriores a hoy
//                         connection.query(
//                             'DELETE FROM turno WHERE fechaTurno < CURDATE() AND id_agenda = ?',
//                             [id],
//                             callback
//                         );
//                     }
//                 );
//             } else {
//                 connection.query(
//                     'SELECT inicio, fin, estado_turno FROM turno WHERE fechaTurno = ? AND id_agenda = ? ORDER BY inicio',
//                     [fechaSeleccionada, id],
//                     (selectErr, existingTurnos) => {
//                         if (selectErr) return callback(selectErr);
//                         callback(null, existingTurnos); // Enviar los turnos existentes
//                     }
//                 );
//             }
//         }
//     );
// },
insertarTurnos(id, fechaSeleccionada, callback) {
    connection.query(
        'SELECT horaInicio, horaFin, duracion FROM agenda WHERE id = ?',
        [id],
        (err, results) => {
            if (err) return callback(err);
            if (results.length === 0) return callback(new Error('Agenda no encontrada'));

            const { horaInicio, horaFin, duracion } = results[0];

            const inicio = moment(`${fechaSeleccionada} ${horaInicio}`, 'YYYY-MM-DD HH:mm:ss');
            const fin = moment(`${fechaSeleccionada} ${horaFin}`, 'YYYY-MM-DD HH:mm:ss');

            const turnos = [];
            for (let m = inicio.clone(); m.isBefore(fin); m.add(duracion, 'minutes')) {
                turnos.push([
                    id,
                    fechaSeleccionada,
                    m.format('HH:mm:ss'),
                    m.clone().add(duracion, 'minutes').format('HH:mm:ss'),
                    2 // Estado: Libre
                ]);
            }

            connection.query(
                'INSERT INTO turno (id_agenda, fechaTurno, inicio, fin, estado_turno) VALUES ?',
                [turnos],
                (insertErr, insertResults) => {
                    if (insertErr) return callback(insertErr);

                    // Limpia turnos anteriores a hoy
                    connection.query(
                        'DELETE FROM turno WHERE fechaTurno < CURDATE() AND id_agenda = ?',
                        [id],
                        callback
                    );
                }
            );
        }
    );
},


    turnosPorFecha(id, fechaSeleccionada, callback) {
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
            WHERE a.id = ? AND t.fechaTurno = ? ` , [id, fechaSeleccionada], callback);
    },


crearTurnosDiarios(id, callback) {
    connection.query('SELECT horaInicio, horaFin, duracion FROM agenda WHERE id = ?', [id], (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(new Error('Agenda no encontrada'));

        const { horaInicio, horaFin, duracion } = results[0];
        const inicio = moment(`${moment().format('YYYY-MM-DD')} ${horaInicio}`, 'YYYY-MM-DD HH:mm:ss');
        const fin = moment(`${moment().format('YYYY-MM-DD')} ${horaFin}`, 'YYYY-MM-DD HH:mm:ss');


        const mInicio = moment(inicio);
        const mFin = moment(fin);

        const turnos = [];
        for (let m = mInicio.clone(); m.isBefore(mFin); m.add(duracion, 'minutes')) {
            turnos.push([
                id,
                m.format('YYYY-MM-DD'),
                m.format('HH:mm:ss'),
                m.clone().add(duracion, 'minutes').format('HH:mm:ss'),
                2 // estado_turno = Libre
            ]); 
        }

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
    });
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
}, 
// PARTE DE SOBRETURNOS
validarYCrearSobreturnoConAsignacion (idAgenda, fecha, horaInicio, pacienteId, motivo, callback) {
    const sqlAgenda = 'SELECT * FROM agenda WHERE id = ?';
    connection.query(sqlAgenda, [idAgenda], (err, agendaRes) => {
        if (err) return callback(err);
        if (agendaRes.length === 0) return callback(null, 'Agenda no encontrada');

        const agenda = agendaRes[0];

        // ✅ Validación de fecha no pasada
        const fechaTurno = moment(fecha, 'YYYY-MM-DD');
        const hoy = moment().startOf('day');
        if (fechaTurno.isBefore(hoy)) {
            return callback(null, 'No se puede asignar un sobreturno en una fecha pasada');
        }

        // Validación de rango horario
        const horaInicioMoment = moment(horaInicio, 'HH:mm');
        const inicio = moment(agenda.horainicio, 'HH:mm:ss');
        const fin = moment(agenda.horaFin, 'HH:mm:ss');

        if (horaInicioMoment.isBefore(inicio) || horaInicioMoment.clone().add(agenda.duracion, 'minutes').isAfter(fin)) {
            return callback(null, 'El horario está fuera del rango permitido');
        }

        // Validación de cantidad máxima de sobreturnos
        const sqlCount = `SELECT COUNT(*) AS total FROM sobreturnos WHERE id_agenda = ? AND fechaTurno = ?`;
        connection.query(sqlCount, [idAgenda, fecha], (err, countRes) => {
            if (err) return callback(err);
            if (countRes[0].total >= agenda.sobreturnos) {
                return callback(null, 'Ya se alcanzó el máximo de sobreturnos permitidos');
            }

            // Inserción del sobreturno
            const finTurno = horaInicioMoment.clone().add(agenda.duracion, 'minutes').format('HH:mm:ss');
            const sqlInsert = `
                INSERT INTO sobreturnos (id_agenda, fechaTurno, inicio, fin, estado_turno, id_paciente, motivo)
                VALUES (?, ?, ?, ?, 'Reservado', ?, ?)
            `;
            connection.query(sqlInsert, [idAgenda, fecha, horaInicio, finTurno, pacienteId, motivo], (err) => {
                if (err) return callback(err);
                callback(null, null);
            });
        });
    });
},

eliminarSobreturnosViejos (id, callback) {
    const sql = 'DELETE FROM sobreturnos WHERE id_agenda = ? AND fechaTurno < CURDATE()';
    connection.query(sql, [id], (err, result) => {
        if (err) return callback(err);
        
    });
},

eliminarTurnosViejos (id, callback) {
    const sql = 'DELETE FROM turno WHERE id_agenda = ? AND fechaTurno < CURDATE()';
    connection.query(sql, [id], (err, result) => {
        if (err) return callback(err);
    });
},

verSobreturnosPorAgenda: (idAgenda, callback) => {
    const sql = `
        SELECT s.*, p.nombre_completo AS paciente_nombre, d.nombre_completo AS doctor_nombre
        FROM sobreturnos s
        LEFT JOIN paciente p ON s.id_paciente = p.id
        LEFT JOIN agenda a ON s.id_agenda = a.id
        LEFT JOIN doctores d ON a.id_doctor = d.id
        WHERE s.id_agenda = ? 
    `;
    connection.query(sql, [idAgenda], callback);
},


asignarPacienteASobreturno: (sobreturnoId, pacienteId, motivo, callback) => {
    const sql = `UPDATE sobreturnos SET id_paciente = ?, motivo = ?, estado_turno = 'Reservado' WHERE id = ?`;
    connection.query(sql, [pacienteId, motivo, sobreturnoId], callback);
},


//----------------------------------------------------------------

// ------ codigo de prueba ----------------////
insertarTurnosSiNoExisten(id, fecha, callback) {
    // Obtener el primer y último día del mes
    const inicioMes = moment(fechaReferencia).startOf('month');
    const finMes = moment(fechaReferencia).endOf('month');
  // Consultar si ya hay turnos en esa fecha para la agenda
    connection.query(
        'SELECT COUNT(*) AS cantidad FROM turno WHERE id_agenda = ? AND fechaTurno = ?',
        [id, fecha],
        (err, results) => {
        if (err) return callback(err);

        if (results[0].cantidad > 0) {
            // Ya existen turnos para esa fecha
            return callback(null);
        }

        // Si no existen, generarlos (tomar horas y duración de agenda)
        connection.query(
            'SELECT horaInicio, horaFin, duracion FROM agenda WHERE id = ?',
            [id],
            (err, resAgenda) => {
            if (err) return callback(err);
            if (resAgenda.length === 0) return callback(new Error('Agenda no encontrada'));

            const { horaInicio, horaFin, duracion } = resAgenda[0];

            const inicio = moment(`${fecha} ${horaInicio}`, 'YYYY-MM-DD HH:mm:ss');
            const fin = moment(`${fecha} ${horaFin}`, 'YYYY-MM-DD HH:mm:ss');
            const turnos = [];

            for (let m = inicio.clone(); m.isBefore(fin); m.add(duracion, 'minutes')) {
                turnos.push([id, fecha, m.format('HH:mm:ss'), m.clone().add(duracion, 'minutes').format('HH:mm:ss'), 2]);
            }

            connection.query(
                'INSERT INTO turno (id_agenda, fechaTurno, inicio, fin, estado_turno) VALUES ?',
                [turnos],
                (insertErr) => {
                if (insertErr) return callback(insertErr);
                callback(null);
                }
            );
            }
        );
        }
    );
    },

insertarTurnosMesSiNoExisten(id, fechaReferencia, callback) {
    
    
    const referencia= moment(fechaReferencia, 'YYYY-MM-DD');
    //const inicioMes = moment(fechaReferencia).startOf('month');
    const finMes = moment(fechaReferencia).endOf('month');
    
    // Obtener la configuración de la agenda
    connection.query(
        'SELECT horaInicio, horaFin, duracion FROM agenda WHERE id = ?',
        [id],
        (err, resAgenda) => {
            if (err) return callback(err);
            if (resAgenda.length === 0) return callback(new Error('Agenda no encontrada'));

            const { horaInicio, horaFin, duracion } = resAgenda[0];

            // Recorrer cada día del mes
            const fechasProcesadas = [];
            const errores = [];

            let diaActual = referencia.clone();

            function procesarSiguienteDia() {
                if (diaActual.isAfter(finMes)) {
                    // Finalizado el mes
                    return callback(errores.length ? errores : null, fechasProcesadas);
                }

                const fecha = diaActual.format('YYYY-MM-DD');

                // Verificar si ya hay turnos para ese día
                connection.query(
                    'SELECT COUNT(*) AS cantidad FROM turno WHERE id_agenda = ? AND fechaTurno = ?',
                    [id, fecha],
                    (err, results) => {
                        if (err) {
                            errores.push({ fecha, error: err });
                            diaActual.add(1, 'day');
                            return procesarSiguienteDia();
                        }

                        if (results[0].cantidad > 0) {
                            // Ya hay turnos para este día, saltar
                            diaActual.add(1, 'day');
                            return procesarSiguienteDia();
                        }

                        // Generar los turnos
                        const inicio = moment(`${fecha} ${horaInicio}`, 'YYYY-MM-DD HH:mm:ss');
                        const fin = moment(`${fecha} ${horaFin}`, 'YYYY-MM-DD HH:mm:ss');
                        const turnos = [];

                        for (let m = inicio.clone(); m.isBefore(fin); m.add(duracion, 'minutes')) {
                            turnos.push([id, fecha, m.format('HH:mm:ss'), m.clone().add(duracion, 'minutes').format('HH:mm:ss'), 2]);
                        }

                        connection.query(
                            'INSERT INTO turno (id_agenda, fechaTurno, inicio, fin, estado_turno) VALUES ?',
                            [turnos],
                            (insertErr) => {
                                if (insertErr) {
                                    errores.push({ fecha, error: insertErr });
                                } else {
                                    fechasProcesadas.push(fecha);
                                }
                                diaActual.add(1, 'day');
                                procesarSiguienteDia();
                            }
                        );
                    }
                );
            }

            // Iniciar proceso
            procesarSiguienteDia();
        }
    );
},
insertarTurnosMesSiguiente(id, fechaReferencia, callback) {
    // Obtener el primer y último día del mes
    
    const inicioMes = moment(fechaReferencia).startOf('month');
    const finMes = moment(fechaReferencia).endOf('month');
    
    // Obtener la configuración de la agenda
    connection.query(
        'SELECT horaInicio, horaFin, duracion FROM agenda WHERE id = ?',
        [id],
        (err, resAgenda) => {
            if (err) return callback(err);
            if (resAgenda.length === 0) return callback(new Error('Agenda no encontrada'));

            const { horaInicio, horaFin, duracion } = resAgenda[0];

            // Recorrer cada día del mes
            const fechasProcesadas = [];
            const errores = [];

            let diaActual = inicioMes.clone();

            function procesarSiguienteDia() {
                if (diaActual.isAfter(finMes)) {
                    // Finalizado el mes
                    return callback(errores.length ? errores : null, fechasProcesadas);
                }

                const fecha = diaActual.format('YYYY-MM-DD');
                
                if (diaActual.isBefore(moment().startOf('day'))) {
                    diaActual.add(1, 'day');
                    return procesarSiguienteDia();
                }
                // Verificar si ya hay turnos para ese día
                connection.query(
                    'SELECT COUNT(*) AS cantidad FROM turno WHERE id_agenda = ? AND fechaTurno = ?',
                    [id, fecha],
                    (err, results) => {
                        if (err) {
                            errores.push({ fecha, error: err });
                            diaActual.add(1, 'day');
                            return procesarSiguienteDia();
                        }

                        if (results[0].cantidad > 0) {
                            // Ya hay turnos para este día, saltar
                            diaActual.add(1, 'day');
                            return procesarSiguienteDia();
                        }

                        // Generar los turnos
                        const inicio = moment(`${fecha} ${horaInicio}`, 'YYYY-MM-DD HH:mm:ss');
                        const fin = moment(`${fecha} ${horaFin}`, 'YYYY-MM-DD HH:mm:ss');
                        const turnos = [];

                        for (let m = inicio.clone(); m.isBefore(fin); m.add(duracion, 'minutes')) {
                            turnos.push([id, fecha, m.format('HH:mm:ss'), m.clone().add(duracion, 'minutes').format('HH:mm:ss'), 2]);
                        }

                        connection.query(
                            'INSERT INTO turno (id_agenda, fechaTurno, inicio, fin, estado_turno) VALUES ?',
                            [turnos],
                            (insertErr) => {
                                if (insertErr) {
                                    errores.push({ fecha, error: insertErr });
                                } else {
                                    fechasProcesadas.push(fecha);
                                }
                                diaActual.add(1, 'day');
                                procesarSiguienteDia();
                            }
                        );
                    }
                );
            }

            // Iniciar proceso
            procesarSiguienteDia();
        }
    );
},
obtenerTurnosPorAgenda: (id, callback) => {
     connection.query(
        `SELECT fechaTurno AS fecha, 
                SUM(CASE WHEN estado_turno = 2 THEN 1 ELSE 0 END) AS libres,
                SUM(CASE WHEN estado_turno != 2 THEN 1 ELSE 0 END) AS reservados
         FROM turno 
         WHERE id_agenda = ?
         GROUP BY fechaTurno`,
        [id],
        (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        }
    );
},
//----------------------------------------------------------//
cancelarTurno  (turnoId, callback)  {
    const sql = `
        UPDATE turno 
        SET id_paciente = NULL, motivo = NULL, estado_turno = '2' 
        WHERE id = ?
    `;

    connection.query(sql, [turnoId], (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
},

diasLaboralesPorAgenda(id, callback) {
    const sql = 'SELECT dias FROM agenda WHERE id = ?';
    
    const diaTextoANumero = {
    'domingo': 0,
    'lunes': 1,
    'martes': 2,
    'miercoles': 3,
    'jueves': 4,
    'viernes': 5,
    'sabado': 6
    };

    connection.query(sql, [id], (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(new Error('Agenda no encontrada'));
        
        const diasLaboralesTexto = results[0].dias.split('-').map(dia => dia.trim());
        
        const diasLaborales = diasLaboralesTexto.map(dia => diaTextoANumero[dia]);
        
        callback(null, diasLaborales);
    });
    
}
};

module.exports = Agenda;

