const express = require('express');
const cors = require('cors');
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
app.use(express.static('public', {
    index: 'index.html',
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) res.setHeader('Content-Type', 'text/javascript');
    }
}));