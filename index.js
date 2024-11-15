const express = require('express');
const pug = require('pug');
const app = express(); //creo el objeto aplicacion
const port = 3000;
const doctoresRoutes = require('./routes/doctorRoutes');
const authRoutes = require('./routes/loginRoutes');
const inicioRouter = require('./routes/inicioRoutes'); 
const pacienteRoutes = require('./routes/pacienteRoutes');
const agendaRoutes = require('./routes/agendaRoutes');
const turnoRoutes = require('./routes/turnoRoutes');
//configuraciones para pug
app.set('view engine', 'pug'); 
app.set('views', './views');

//middlewares



//middleware para manejar urlencoded
app.use(express.urlencoded({ extended: true }));

// Middleware para recibir JSON en solicitudes POST
app.use(express.json());


// Rutas
app.use('/doctores', doctoresRoutes);
app.use('/', authRoutes);
app.use('/', inicioRouter);
app.use('/pacientes', pacienteRoutes);
app.use('/agendas', agendaRoutes);
app.use('/turnos', turnoRoutes);


app.use(express.static('public'));

//levanto el servicio
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}/login`);
})