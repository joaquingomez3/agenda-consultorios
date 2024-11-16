const mysql = require('mysql2');

const connection = mysql.createConnection({
    //  host: 'bpp9htcpltkaxbbfn2jv-mysql.services.clever-cloud.com',
    //  user: 'urb0iieawdsnbr7t',
    //  password: 'M2rByql4bNrOhiGNmICU',
    //  database: 'bpp9htcpltkaxbbfn2jv'
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'agenda-consultorios'
});

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

module.exports = connection;
