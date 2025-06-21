const AgendaModel = require('../models/modeloAgenda');
const PacienteModel = require('../models/modeloPaciente');
const DoctorModel = require('../models/modeloDoctor');
const moment = require('moment');

exports.listarAgendas = (req, res) => {

    AgendaModel.listarAgendas((err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al listar agendas' });
        }
        res.render('agenda/listarAgendas', { agendas: results, usuario: req.user });
    });
};
exports.generarTurnosAgendas = (req, res) => {
    AgendaModel.listarAgendas((err, results) => {
        if (err) {
            console.error("Error al obtener las agendas :", err);
            return;
        }

        results.forEach(agenda => {
            const id = agenda.id;
            AgendaModel.crearTurnosDiarios(id, (err) => {
                if (err) {
                    console.error(`Error al generar turnos para la agenda ${id}:`, err);
                } else {
                    console.log(`Turnos generados automáticamente para la agenda ${id}`);
                }
            });
        });
    });
}

exports.generarTurnosDiarios = (req, res) => {
    const id = req.params.id;
    
    AgendaModel.crearTurnosDiarios(id,(err) => {
        if (err) {
            console.error("Error al generar turnos diarios:", err);
            return res.status(500).json({ error: 'Error al generar turnos diarios' });
        }
        AgendaModel.verTurnosAgenda(id, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error al traer turnos' });
            }
            res.render('agenda/verTurnosAgenda', { turnos: results });
        });
    });
};
exports.vistaCrear = (req, res) => {
    res.render('agenda/crearAgenda');
};



exports.formularioCrearAgenda = (req, res) => {
    DoctorModel.obtenerDoctores((err, doctores) => {
        if (err) {
            return res.status(500).send('Error al cargar doctores');
        }
    AgendaModel.obtenerSucursales((err, sucursales) => {
        if (err) {
            return res.status(500).send('Error al cargar sucursales');
        }
        res.render('agenda/crearAgenda', { doctores, sucursales });
    });
});
};

exports.crearAgenda = (req, res) => {
    
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
    } = req.body;

    const agenda = {
        id_sucursal,
        matricula,
        clasificacion,
        sobreturnos: parseInt(sobreturnos),
        dias,
        horainicio,
        horaFin,
        duracion,
        fechaCreacion,
        id_doctor
    };

    AgendaModel.crearAgenda(agenda, (err) => {
        if (err) {
            console.error('Error al crear agenda:', err);
            return res.status(500).json({ error: 'Error al crear agenda' });
        }
        res.redirect('/agendas/');
        
    });
};


exports.vistaActualizar = (req, res) => {
    const id = req.params.id;
    AgendaModel.obtenerAgendaPorId(id, (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ error: 'Error al traer agenda' });
        }
        res.render('agenda/actualizarAgenda', { agenda: results[0] });
    });
};

exports.actualizarAgenda = (req, res) => {
    const { id_sucursal, clasificacion, max_sobreturnos, doctor_especialidad_id } = req.body;
    const id = req.params.id;
    AgendaModel.actualizarAgenda(id, { id_sucursal, clasificacion, max_sobreturnos, doctor_especialidad_id }, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar agenda' });
        }
        res.redirect('/agendas'); // Redirige a la lista de agendas después de actualizar
    });
};

// exports.verTurnosAgenda = (req, res) => {
//     const id = req.params.id;

//     AgendaModel.verTurnosAgenda(id, (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: 'Error al traer turnos' });
//         }
        
//         res.render('agenda/verTurnosAgenda', { turnos: results, formatearFecha, agenda: {id} });
//     });
// };
exports.verTurnosAgenda = (req, res) => {
    const id = req.params.id;
    const fecha = moment().format('YYYY-MM-DD'); // Fecha actual

    AgendaModel.verTurnosAgenda(id, fecha, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al traer turnos' });
        }
        
        res.render('agenda/verTurnosAgenda', { turnos: results, formatearFecha, agenda: {id}, usuario: req.user  });
    });
};

exports.turnosFechaSeleccionada = (req, res) => {
    const fechaSeleccionada = req.params.fecha;
    const id = req.params.id;
    
    AgendaModel.insertarTurnos(id, fechaSeleccionada, (err) => {
        if (err) {
            console.error('Error al insertar turnos:', err);
            return res.status(500).json({ error: 'Error al insertar turnos' });
        }

        // Solo continuar si no hubo error
        AgendaModel.turnosPorFecha(id, fechaSeleccionada, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error al traer turnos' });
            }

            res.render('agenda/verTurnosAgenda', {
                turnos: results,
                formatearFecha,
                agenda: { id }
            });
        });
    });
};

exports.mostrarAsignacionPaciente = (req, res) => {
    const turnoId = req.params.turnoId;
    
    const returnUrl = req.get('referer');
    PacienteModel.getAll((err, pacientes) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener la lista de pacientes' });
        }
        
    res.render('agenda/asignarPaciente', { turnoId, pacientes, returnUrl});
    });
}

exports.asignarPaciente = (req, res) => {
    const { turno_id, paciente_id, motivo, returnUrl} = req.body;
    
    
    AgendaModel.asignarPacienteATurno(turno_id, paciente_id, motivo, (err) => {
        if (err) {
            console.error("Error al asignar paciente:", err);
            return res.status(500).send("Error al asignar paciente.");
        }

        console.log(turno_id);
    AgendaModel.obtenerIdAgendaPorTurno(turno_id, (err, agendaId) => {
            if (err || !agendaId) {
                return res.status(500).json({ error: 'Error al obtener el ID de la agenda' });
            }

            
            res.redirect(returnUrl || '/agendas');
        });
    });
};

function formatearFecha(fechaStr) {
    
    const fecha = new Date(fechaStr);

    
    const dia = fecha.getDate().toString().padStart(2, '0'); 
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); 
    const anio = fecha.getFullYear();

    
    return `${dia}-${mes}-${anio}`;
}



