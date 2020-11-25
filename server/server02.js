const express = require('express')
const app = express();

require('./config/config');

app.use(express.urlencoded({
  extended:false
}))
app.get('/usuario', function (req, res) {
  res.json('get Usuario')
})

app.post('/usuario', function (req, res) {
    let body=req.body;
    if(body.nombre===undefined){
      res.status(400).json({//400 es comun cuando no mandamos informacion como el servicio la espera
        ok:false,
        mensaje:'El nombre es necesario'
      })
    }
    res.json({persona:body});
  })

app.put('/usuario', function (req, res) {
  res.json('PUT Usuario') 
})

app.delete('/usuario', function (req, res) {
  res.json('DELETE Usuario')  
})

app.put('/usuario/:id', function (req, res) {
  let id=req.params.id;
  res.json({
    id
  })  
})

app.listen(process.env.PORT,()=>{
  console.log(`Escuchando puerto 3000`);
  
})