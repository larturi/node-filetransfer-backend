const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

const app = express();

conectarDB();

// Habilitar Cors
const opcionesCors = {
    origin: process.env.FRONTEND_URL
};

console.log(process.env.FRONTEND_URL);

app.use( cors(opcionesCors) );

// Puerto de la APP
const port = process.env.PORT || 4000;

// Habilitar leer los valores de los request
app.use( express.json() );

// Habilitar carpeta publica
app.use(express.static('uploads'));

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

app.listen(port, '0.0.0.0', () => {
    console.info(`Servidor escuchando el puerto ${port}`);
});
