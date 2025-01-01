const { Router } = require('express');
const router = Router();

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname,'personas.json');

const readJsonFile = () =>{
    const data = fs.readFileSync(filePath,'utf-8');
    return JSON.parse(data);
}

router.get('/personas/',(req,res) =>{
    let data = readJsonFile();
    if(data.length > 0){
        res.json(data);    
    }else{
        res.send({"message":"No hay data"});
    }
});

router.get('/personas/:id',(req,res) =>{
    let data = readJsonFile();
    if(data.some(p => p.personaId == req.params.id)){
        res.json(data.filter(p => p.personaId == req.params.id))
    }else{
        res.send({"message":`No existe data con ese id igual a ${req.params.id}`});
    }
})

router.post('/personas/',(req,res) =>{
    let data = readJsonFile();
    let ids = null, objeto = null;

    if(data.length > 0){
        ids = data.map(p => p.personaId);
        objeto = {
            personaId: (Math.max(...ids) + 1).toString(),
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            numero: req.body.numero,
            ubicacion: req.body.ubicacion,
            estado: req.body.estado
        }
    }

    data.push(objeto);
    
    const personasCurrent = JSON.stringify(data,null,2);
    fs.writeFileSync(filePath,personasCurrent,'utf-8');

    res.json(objeto)
});

router.put('/personas/:id',(req,res) =>{
    let data = readJsonFile();

    data.forEach(p =>{
        if(p.personaId == req.params.id){
            p.nombres = req.body.nombres,
            p.apellidos = req.body.apellidos,
            p.numero = req.body.numero,
            p.ubicacion = req.body.ubicacion,
            p.estado = req.body.estado
        }
    })

    const personasCurrent = JSON.stringify(data,null,2);
    fs.writeFileSync(filePath,personasCurrent,'utf-8');

    res.json(data.filter(p => p.personaId == req.params.id));
});

router.delete('/personas/:id',(req,res) =>{
    let data = readJsonFile();

    let personasCurrent = JSON.stringify(data.filter(p => p.personaId != req.params.id),null,2);

    fs.writeFileSync(filePath,personasCurrent,'utf-8');

    res.json(data.filter(p => p.personaId == req.params.id));
});

module.exports = router;