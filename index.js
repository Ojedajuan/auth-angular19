const express = require('express');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

// Debug variables de entorno
console.log('Variables de entorno:');
console.log('BD_CNN:', process.env.BD_CNN ? 'Configurada' : 'NO CONFIGURADA');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

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

//Servir archivos estáticos (catch-all para SPA)
// Endpoint para que Angular obtenga la URL del API
app.get('/api/config', (req, res) => {
  res.json({
    apiUrl: process.env.API_URL || `https://${req.headers.host}/api`
  });
});

// Servir SPA para rutas que no son archivos
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});