const AgendaModel = require('../models/modeloAgenda');
const PacienteModel = require('../models/modeloPaciente');
const FeriadosModel = require('../models/modeloFeriados');
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
    res.render('agenda/crearAgenda', { usuario: req.user });
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
        res.render('agenda/crearAgenda', { doctores, sucursales, usuario: req.user });
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
        res.redirect('/agendas/?creada=1');
        
    });
};


exports.vistaActualizar = (req, res) => {
    const id = req.params.id;
    AgendaModel.obtenerAgendaPorId(id, (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ error: 'Error al traer agenda' });
        }
        res.render('agenda/actualizarAgenda', { agenda: results[0], usuario: req.user });
    });
};

exports.actualizarAgenda = (req, res) => {
    const {id, id_sucursal, clasificacion, max_sobreturnos } = req.body;
    
    AgendaModel.actualizarAgenda(id, { id_sucursal, clasificacion, max_sobreturnos}, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar agenda' });
        }
        res.redirect('/agendas/?actualizada=1');

    });
};


exports.verTurnosAgenda = (req, res) => {
    const id = req.params.id;
    const fecha = req.params.fecha || moment().format('YYYY-MM-DD'); // Fecha actual si no se pasa fecha

    FeriadosModel.getAll((err, feriados) => {
        if (err) {
            console.error('Error al obtener feriados:', err);
            return res.status(500).json({ error: 'Error al obtener feriados' });
        }
        const fechasNoLaborales = feriados.map(f => moment(f.fecha).format('YYYY-MM-DD'));

        
    
    AgendaModel.eliminarSobreturnosViejos(id, (err) => {
        if (err) {
            console.error('Error al eliminar sobreturnos viejos:', err);
        }
    });
    // AgendaModel.insertarTurnosSiNoExisten(id, fecha, (err) => {
    //     if (err) return res.status(500).json({ error: 'Error al generar turnos' });

    AgendaModel.turnosPorFecha(id, fecha, (err, turnos) => {
        if (err) return res.status(500).json({ error: 'Error al obtener turnos' });

    AgendaModel.verSobreturnosPorAgenda(id, (err, sobreturnos) => {
        if (err) return res.status(500).json({ error: 'Error al obtener sobreturnos' });

        res.render('agenda/verTurnosAgenda', {
            turnos,
            sobreturnos,
            agenda: { id },
            usuario: req.user,
            formatearFecha,
            fechaSeleccionada: fecha,
            fechasNoLaborales
        });
        });
    });
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
        AgendaModel.verSobreturnosPorAgenda(id,  (err, sobreturnos) => {
            if (err) {
                return res.status(500).json({ error: 'Error al traer sobreturnos' });
            }

            res.render('agenda/verTurnosAgenda', {
                turnos: results,
                formatearFecha,
                sobreturnos,
                agenda: { id },
                usuario: req.user
            });
        });
        });
    });
};

exports.mostrarAsignacionPaciente = (req, res) => {
    const turnoId = req.params.turnoId;
    const dni = req.user.dni; // Obtener el DNI del usuario autenticado
    const returnUrl = req.get('referer');
    PacienteModel.getAll((err, pacientes) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener la lista de pacientes' });
        }
    
    PacienteModel.obtenerPorDni(dni, (err, usuario) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el paciente' });
        }
           
    res.render('agenda/asignarPaciente', { turnoId, pacientes, returnUrl, usuario: req.user, paciente:usuario });
    });
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

//PARTE DE SOBRETURNOS
exports.vistaCrearSobreturno = (req, res) => {
    const idAgenda = req.params.id;

    AgendaModel.obtenerAgendaPorId(idAgenda, (err, resultados) => {
        if (err || resultados.length === 0) return res.status(500).send("Error al cargar agenda");

        const agenda = resultados[0];
        PacienteModel.getAll((err, pacientes) => {
            if (err) return res.status(500).send("Error al obtener pacientes");

            res.render('agenda/crearSobreturno', { agenda, pacientes , usuario: req.user});  // <-- pasamos error y formData vacíos);
        });
    });
};

exports.crearSobreturno = (req, res) => {
    const idAgenda = req.params.id;
    const { fecha, inicio, paciente_id, motivo } = req.body;

    AgendaModel.validarYCrearSobreturnoConAsignacion(idAgenda, fecha, inicio, paciente_id, motivo, (err, mensajeError) => {
        if (err) return res.status(500).send("Error al crear sobreturno");

        if (mensajeError) {
            // Volvemos a cargar la agenda y pacientes para volver a renderizar el formulario
            AgendaModel.obtenerAgendaPorId(idAgenda, (errAgenda, resultados) => {
                if (errAgenda || resultados.length === 0) return res.status(500).send("Error al cargar agenda");

                const agenda = resultados[0];
                PacienteModel.getAll((errPacientes, pacientes) => {
                    if (errPacientes) return res.status(500).send("Error al obtener pacientes");

                    res.render('agenda/crearSobreturno', {
                        agenda,
                        pacientes,
                        error: mensajeError, // <-- pasamos el mensaje
                        formData: { fecha, inicio, paciente_id, motivo } // <-- opcional para repoblar el formulario
                    });
                });
            });
        } else {
            res.redirect(`/agendas/${idAgenda}/turnos/${fecha}`);
        }
    });
};


// ------ codigo de prueba ----------------////
exports.verTurnosAgendaPorFecha = (req, res) => {
    const id = req.params.id;
    const fecha = req.params.fecha || moment().format('YYYY-MM-DD'); // Si no se pasa fecha, tomar hoy

  // Primero insertar turnos si no existen
    AgendaModel.insertarTurnosSiNoExisten(id, fecha, (err) => {
        if (err) return res.status(500).json({ error: 'Error al generar turnos' });

    // Traer turnos luego de la inserción (o si ya existen)
    AgendaModel.turnosPorFecha(id, fecha, (err, turnos) => {
        if (err) return res.status(500).json({ error: 'Error al obtener turnos' });

      // Traer sobreturnos si corresponde
    AgendaModel.verSobreturnosPorAgenda(id, (err, sobreturnos) => {
        if (err) return res.status(500).json({ error: 'Error al obtener sobreturnos' });

        res.render('agenda/verTurnosAgenda', {
            turnos,
            sobreturnos,
            agenda: { id },
            usuario: req.user,
            formatearFecha,
            fechaSeleccionada: fecha
            });
        });
        });
    });
};
//----------------------------------------------------------//
exports.cancelarTurno = (req, res) => {
    const turnoId = req.params.id;
    console.log("ID del turno a cancelar:", turnoId);

    AgendaModel.cancelarTurno(turnoId, (err) => {
        if (err) {
            console.error("Error al cancelar turno:", err);
            return res.status(500).json({ success: false });
        }

        return res.json({ success: true });
    });
};

//----------------------------------------------------------//
exports.vistaCalendario = (req, res) => {
    const id = req.params.id;
    const fecha = req.params.fecha || moment().format('YYYY-MM-DD'); // Fecha actual si no se pasa fecha
    
    const todosLosDias = [0, 1, 2, 3, 4, 5, 6];
    
    
    AgendaModel.insertarTurnosMesSiNoExisten(id, fecha, (err) => {
        if (err) {
            console.error('Error al generar turnos:', err);
            return res.status(500).json({ error: 'Error al generar turnos' });
        }
    });
    AgendaModel.eliminarTurnosViejos(id, (err) => {
        if (err) {
            console.error('Error al eliminar turnos viejos:', err);
        }
    });
    FeriadosModel.getAll((err, feriados) => {
        if (err) {
            console.error('Error al obtener feriados:', err);
            return res.status(500).json({ error: 'Error al obtener feriados' });
        }
        const fechasNoLaborales = feriados.map(f => moment(f.fecha).format('YYYY-MM-DD'));
    AgendaModel.obtenerAgendaPorId(id, (err, agenda) => {
        if (err || agenda.length === 0) return res.status(500).send("Error al cargar agenda");
    

    AgendaModel.diasLaboralesPorAgenda(id, (err, diasLaborales) => {  
        if (err) {
            console.error('Error al obtener días laborales:', err);
            return res.status(500).json({ error: 'Error al obtener días laborales' });
        }
        const diasNoLaborales = todosLosDias.filter(d => !diasLaborales.includes(d));
    AgendaModel.obtenerTurnosPorAgenda(id, (err, turnos) => {
            if (err) {
                console.error('Error al obtener turnos:', err);
                return res.status(500).json({ error: 'Error al obtener turnos' });
            }
            // Agrupar turnos por fecha
            const turnosPorFecha = {};

            turnos.forEach(t => {
                const fecha = moment(t.fecha).format('YYYY-MM-DD');
                turnosPorFecha[fecha] = {
                    libres: parseInt(t.libres, 10),
                    reservados: parseInt(t.reservados, 10)
                };
            });

    
        res.render('agenda/calendario', {agenda: agenda[0], usuario: req.user, fechasNoLaborales, diasNoLaborales, turnos: turnosPorFecha });
    });
    
    });
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

function esDiaValidoParaAgenda(fechaISO, diasLaboralesTexto) {
    console.log(`Verificando si la fecha ${fechaISO} es válida para los días laborales: ${diasLaboralesTexto}`);
    const diasTextoAIndice = {
        'Domingo': 0,
        'Lunes': 1,
        'Martes': 2,
        'Miércoles': 3,
        'Jueves': 4,
        'Viernes': 5,
        'Sábado': 6
    };

    const fecha = new Date(fechaISO);
    const diaSemana = fecha.getDay();

    const diasPermitidos = diasLaboralesTexto.split('-,').map(dia => diasTextoAIndice[dia.trim()]);
    return diasPermitidos.includes(diaSemana);
}
exports.vistaCrearFeriado = (req, res) => {
    res.render('agenda/crearFeriado', { usuario: req.user });
}

exports.crearTurnosMesSiguiente = (req, res) => {
    const id = req.params.id;
    const fechaReferencia = moment().add(1, 'month').format('YYYY-MM-DD'); // Fecha del primer día del mes siguiente

    AgendaModel.insertarTurnosMesSiguiente(id, fechaReferencia, (err) => {
        if (err) {
            console.error('Error al generar turnos:', err);
            return res.status(500).json({ error: 'Error al generar turnos' });
        }
       
    });
}
exports.crearFeriado = (req, res) => {
    const { fecha, descripcion, agendaId } = req.body;

    if (!fecha || !descripcion) {
        return res.render('agenda/crearFeriado', {
            errores: ['Fecha y descripción son requeridos'],
            agendaId,
            usuario: req.user,
            datosIngresados: req.body
        });
    }

    FeriadosModel.getAll((err, feriados) => {
        if (err) {
            console.error('Error al obtener feriados:', err);
            return res.status(500).json({ error: 'Error al obtener feriados' });
        }

        // Verificar si ya existe por fecha o descripción
        const yaExiste = feriados.some(f =>
            f.fecha === fecha || f.descripcion.toLowerCase() === descripcion.toLowerCase()
        );

        if (yaExiste) {
            return res.render('agenda/crearFeriado', {
                errores: ['Ya existe un feriado con esa fecha o descripción'],
                agendaId,
                usuario: req.user,
                datosIngresados: req.body
            });
        }

        // Crear si no existe
        FeriadosModel.crear(fecha, descripcion, (err) => {
            if (err) {
                console.error('Error al crear feriado:', err);
                return res.status(500).json({ error: 'Error al crear feriado' });
            }

            res.redirect(`/agendas/${agendaId}/calendario?creado=1`);
        });
    });
};


