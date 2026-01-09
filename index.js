const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { dbConeccion } = require('./src/database/config');
 

//CREAR UNA APLICACION DE EXPRESS
const app = express();
//BASE DE DATOS
dbConeccion();

//DIRECTORIO PUBLICO
app.use( express.static('public') );

//CORS
app.use(cors());

//LECTURA Y PARSEO DEL BODY
app.use(express.json());

//RUTAS
app.use('/api/auth', require('./src/routes/auth'));

app.listen( process.env.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
});

//Manejar demas rutas
app.use('*', (req, res) => {
    res.sendFile( __dirname + '/public/index.html' );
});