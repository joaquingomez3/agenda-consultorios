const express = require('express');
const path = require('path');
const pug = require('pug');
const bcriptJs = require('bcryptjs');
const app = express(); //creo el objeto aplicacion
const port = 3000;
const doctoresRoutes = require('./routes/doctorRoutes');
const authRoutes = require('./routes/loginRoutes');
const inicioRouter = require('./routes/inicioRoutes'); 
const pacienteRoutes = require('./routes/pacienteRoutes');
const agendaRoutes = require('./routes/agendaRoutes');
const turnoRoutes = require('./routes/turnoRoutes');
const cookieSession = require('cookie-session');
//configuraciones para pug
app.set('view engine', 'pug'); 
app.set('views', './views');

//middlewares
app.use(express.static(path.join(__dirname, 'public')));


//middleware para manejar urlencoded
app.use(express.urlencoded({ extended: true }));

// Middleware para recibir JSON en solicitudes POST
app.use(express.json());

app.use(cookieSession({
    name: 'session',
    secret: 'una cadena aleatoria',
    // Opciones de la cookie
    maxAge: 24 * 60 * 60 * 1000 // 24 horas en milisegundos
}));

 app.use((req, res, next) => {
      if (!req.session.logueado) { 
         req.session.logueado = false; }
          next(); });
async function hasheo (){
    const contrasenia = await bcriptJs.hash('123', 8);
    
} 
hasheo();

// Rutas
app.use('/doctores', doctoresRoutes);
app.use('/', authRoutes);
app.use('/', inicioRouter);
app.use('/pacientes', pacienteRoutes);
app.use('/agendas', agendaRoutes);
app.use('/turnos', turnoRoutes);


//levanto el servicio
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}/`);
})