const db = require('../config/baseDatos');
const Turno = {};

// Función para generar turnos para todas las agendas
Turno.generarTurnosParaTodasLasAgendas = function () {
    return db.query('SELECT id FROM agenda')
        .then(([agendas]) => {
            // Generar turnos para cada agenda
            const promises = agendas.map((agenda) => {
                const idAgenda = agenda.id;
                return Turno.generarTurnosParaAgenda(idAgenda);
            });
            return Promise.all(promises);
        })
        .then(() => {
            console.log('Turnos generados para todas las agendas.');
        })
        .catch((error) => {
            console.error("Error al generar turnos para todas las agendas:", error);
        });
};

// Función para generar turnos en una agenda específica
Turno.generarTurnosParaAgenda = function (idAgenda) {
    const fechaActual = new Date();
    const fechaTurno = new Date(fechaActual);
    fechaTurno.setHours(0, 0, 0, 0); // Establecer a las 00:00:00

    const promises = [];
    for (let hora = 7; hora < 12; hora += 0.5) { // Intervalos de 30 minutos
        const inicio = new Date(fechaTurno);
        inicio.setHours(Math.floor(hora), (hora % 1) * 60, 0, 0);

        const fin = new Date(inicio);
        fin.setMinutes(inicio.getMinutes() + 30);

        promises.push(
            db.query(
                'INSERT INTO turno (id_agenda, fechaTurno, inicio, fin, estado_turno) VALUES (?, ?, ?, ?, ?)',
                [idAgenda, fechaTurno, inicio, fin, 2] // Estado 2 = Libre
            )
        );
    }

    return Promise.all(promises);
};

// Función para obtener turnos a partir de la fecha actual
Turno.obtenerTurnosFuturosPorAgenda = function (idAgenda, fechaActual) {
    return db.query(
        'SELECT * FROM turno WHERE id_agenda = ? AND fechaTurno >= ? ORDER BY fechaTurno, inicio',
        [idAgenda, fechaActual]
    )
    .then(([turnos]) => {
        return turnos;
    })
    .catch((error) => {
        console.error("Error al obtener turnos futuros para agenda:", error);
        return [];
    });
};

module.exports = Turno;
