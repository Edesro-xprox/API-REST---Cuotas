const { Router } = require('express');
const router = Router();

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname,'cuotas.json');

const readJsonFile = () =>{
    const data = fs.readFileSync(filePath,'utf-8');
    return JSON.parse(data);
}

// Solicitud GET para obtener toda la data
router.get('/cuotas/', (req, res) => {
    let data = readJsonFile();
    if(data.length > 0){
        res.json(data);    
    } else {
        res.send({"message":"No hay data"});
    }
});

// Solicitud GET para obtener data con combinación específica de personaId y cuotaId
router.get('/cuotas/:personaId/:cuotaId', (req, res) => {
    let data = readJsonFile();
    if(data.some(c => c.personaId == req.params.personaId && c.cuotaId == req.params.cuotaId)){
        res.json(data.filter(c => c.personaId == req.params.personaId && c.cuotaId == req.params.cuotaId));
    } else {
        res.send({"message":`No existe data con personaId igual a ${req.params.personaId} y cuotaId igual a ${req.params.cuotaId}`});
    }
});

// Solicitud POST para agregar nueva data
router.post('/cuotas/', (req, res) => {
    let data = readJsonFile();
    let ids = null, objeto = null;

    // Filtrar los datos por personaId
    const personaData = data.filter(c => c.personaId == req.body.personaId);

    if(personaData.length > 0){
        ids = personaData.map(c => c.cuotaId);
        objeto = {
            personaId: req.body.personaId,
            cuotaId: (Math.max(...ids) + 1).toString(),
            monto: req.body.monto,
            estado: req.body.estado
        }
    } else {
        objeto = {
            personaId: req.body.personaId,
            cuotaId: "1",
            monto: req.body.monto,
            estado: req.body.estado
        }
    }

    data.push(objeto);
    
    const cuotasCurrent = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, cuotasCurrent, 'utf-8');

    res.json(objeto);
});

// Solicitud PUT para reemplazar la data respecto a cuotaId y personaId
router.put('/cuotas/:personaId/:cuotaId', (req, res) => {
    let data = readJsonFile();

    data.forEach(c => {
        if(c.personaId == req.params.personaId && c.cuotaId == req.params.cuotaId){
            c.monto = req.body.monto;
            c.estado = req.body.estado;
        }
    });

    const cuotasCurrent = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, cuotasCurrent, 'utf-8');

    res.json(data.filter(c => c.personaId == req.params.personaId && c.cuotaId == req.params.cuotaId));
});

// Solicitud DELETE para eliminar la data respecto a cuotaId y personaId
router.delete('/cuotas/:personaId/:cuotaId', (req, res) => {
    let data = readJsonFile();

    const cuotasCurrent = JSON.stringify(data.filter(c => !(c.personaId == req.params.personaId && c.cuotaId == req.params.cuotaId)), null, 2);

    fs.writeFileSync(filePath, cuotasCurrent, 'utf-8');

    res.json(data.filter(c => c.personaId == req.params.personaId && c.cuotaId == req.params.cuotaId));
});

module.exports = router;