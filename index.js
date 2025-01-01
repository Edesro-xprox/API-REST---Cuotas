const express = require('express');
const morgan = require('morgan');

const app = express();

//Configuración
app.set('port',5000);
app.use(morgan('dev'));
app.use(express.json());

app.use(require('./ruotes/apiPersonas'));
app.use(require('./ruotes/apiCuotas'));

//Iniciando el server
app.listen(app.get('port'),() =>{
    console.log(`Server on port ${app.get('port')}`);
})