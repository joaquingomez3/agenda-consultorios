const AgendaModel = require('../models/modeloAgenda');
const PacienteModel = require('../models/modeloPaciente');


exports.listarAgendas = (req, res) => {
    AgendaModel.listarAgendas((err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al listar agendas' });
        }
        res.render('agenda/listarAgendas', { agendas: results });
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

exports.crearAgenda = (req, res) => {
    const { id_sucursal, clasificacion, max_sobreturnos } = req.body;
    AgendaModel.crearAgenda({ id_sucursal, clasificacion, max_sobreturnos }, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear agenda' });
        }
        res.redirect('/agendas'); // Redirige a la lista de agendas después de crear
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

exports.verTurnosAgenda = (req, res) => {
    const id = req.params.id;
    AgendaModel.verTurnosAgenda(id, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al traer turnos' });
        }
        
        res.render('agenda/verTurnosAgenda', { turnos: results, formatearFecha });
    });
};
exports.mostrarAsignacionPaciente = (req, res) => {
    const turnoId = req.params.turnoId;
    PacienteModel.getAll((err, pacientes) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener la lista de pacientes' });
        }
    res.render('agenda/asignarPaciente', { turnoId, pacientes });
    });
}

exports.asignarPaciente = (req, res) => {
    const { turno_id, paciente_id, motivo } = req.body;
    
    
    AgendaModel.asignarPacienteATurno(turno_id, paciente_id, motivo, (err) => {
        if (err) {
            console.error("Error al asignar paciente:", err);
            return res.status(500).send("Error al asignar paciente.");
        }

        
        AgendaModel.obtenerIdAgendaPorTurno(turno_id, (err, agendaId) => {
            if (err || !agendaId) {
                return res.status(500).json({ error: 'Error al obtener el ID de la agenda' });
            }

            
            res.redirect(`/agendas/${agendaId}/turnos`);
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



