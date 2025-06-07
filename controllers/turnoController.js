const turnoModel = require('../models/modeloTurno');
const pacienteModel = require('../models/modeloPaciente');


exports.listarTurnos = (req, res) => {
    try {
        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0); // Establecer a las 00:00:00
        
        const idAgenda = req.query.id_agenda; // Obtener id_agenda de los parámetros de la URL

        if (!idAgenda) {
            return res.status(400).json({ message: 'ID de agenda es necesario' });
        }

        // Obtener turnos a partir de la fecha actual para una agenda específica
        turnoModel.obtenerTurnosFuturosPorAgenda(idAgenda, fechaActual)
            .then((turnos) => {
                // Renderizar la vista con los turnos futuros y formatear el estado
                const turnosConEstado = turnos.map(turno => {
                    turno.estado_formateado = turno.estado_turno === 2 ? 'Libre' : 'Reservado';
                    return turno;
                });
                res.render('turno/listarTurnos', { turnos: turnosConEstado });
            })
            .catch((error) => {
                console.error("Error al listar turnos:", error);
                res.status(500).json({ message: 'Error al listar turnos' });
            });
    } catch (error) {
        console.error("Error al listar turnos:", error);
        res.status(500).json({ message: 'Error al listar turnos' });
    }
};

// Función para generar turnos automáticamente para todas las agendas
exports.generarTurnosAutomáticamente = (req, res) => {
    turnoModel.generarTurnosParaTodasLasAgendas()
        .then(() => {
            res.status(200).json({ message: 'Turnos generados automáticamente para todas las agendas' });
        })
        .catch((error) => {
            console.error("Error al generar turnos automáticamente:", error);
            res.status(500).json({ message: 'Error al generar turnos automáticamente' });
        });
};

// Función para agendar un turno (reservarlo) para un paciente específico
exports.agendarTurno = (req, res) => {
    const { dni, nombre, idAgenda, fecha, hora } = req.body;

    // Buscar el ID del paciente usando DNI o nombre
    pacienteModel.buscarPacientePorDniONombre(dni, nombre)
        .then((idPaciente) => {
            if (!idPaciente) {
                return res.status(404).json({ message: 'Paciente no encontrado' });
            }

            // Verificar la disponibilidad del turno
            turnoModel.verificarDisponibilidad(idAgenda, fecha, hora)
                .then((disponible) => {
                    if (!disponible) {
                        return res.status(400).json({ message: 'El horario ya está reservado' });
                    }

                    // Agendar el turno
                    turnoModel.agendarTurno(idPaciente, idAgenda, fecha, hora)
                        .then(() => {
                            res.status(200).json({ message: 'Turno reservado con éxito' });
                        })
                        .catch((error) => {
                            console.error("Error al agendar turno:", error);
                            res.status(500).json({ message: 'Error al agendar el turno', error });
                        });
                })
                .catch((error) => {
                    console.error("Error al verificar disponibilidad del turno:", error);
                    res.status(500).json({ message: 'Error al verificar disponibilidad' });
                });
        })
        .catch((error) => {
            console.error("Error al buscar paciente:", error);
            res.status(500).json({ message: 'Error al buscar paciente' });
        });
};
