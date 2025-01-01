const express = require('express');
const morgan = require('morgan');

const app = express();

//Configuración
const port = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(express.json());

app.use(require('./ruotes/apiPersonas'));
app.use(require('./ruotes/apiCuotas'));

//Iniciando el server
app.listen(port,() =>{
    console.log(`Server on port ${port}`);
})