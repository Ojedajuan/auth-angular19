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

// Middleware para reemplazar URLs en archivos JS (antes de static)
app.use((req, res, next) => {
  if (req.path.endsWith('.js')) {
    const filePath = __dirname + '/public' + req.path;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Reemplazar URLs hardcodeadas con la URL actual
    const currentHost = `https://${req.headers.host}`;
    const originalContent = content;
    content = content.replace(/http:\/\/localhost:\d+/g, currentHost);
    content = content.replace(/http:\/\/127\.0\.0\.1:\d+/g, currentHost);
    
    console.log(`Procesando JS: ${req.path}`);
    console.log(`Tenía localhost: ${originalContent.includes('localhost:4000')}`);
    console.log(`Reemplazado con: ${currentHost}`);
    console.log(`Ahora tiene localhost: ${content.includes('localhost:4000')}`);
    
    res.setHeader('Content-Type', 'text/javascript');
    res.send(content);
    return;
  }
  next();
});

//DIRECTORIO PUBLICO
app.use(express.static('public'));

//CORS
app.use(cors({
  origin: ['https://auth-angular19-production.up.railway.app', 'http://localhost:4200'],
  credentials: true
}));

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
app.use((req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});