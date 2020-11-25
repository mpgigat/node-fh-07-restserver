const express = require('express')
const app = express();

//app.use son midleware, son funciones que se van a disparar cada vez que pasen
//por ahi. es decir con cada peticion se disparara.
app.use(express.urlencoded({
  extended:false
}))
 
// app.get('/', function (req, res) {
//   //res.send('Hello World')
//   res.json('Hello World')
// })
 
//**************************************************************************** */
app.get('/usuario', function (req, res) {
  res.json('get Usuario')
})

// app.post('/usuario', function (req, res) {
//   res.json('POST Usuario')   //CREAR, AUNQUE ES UNA CONVENCION
// })

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

// app.post('/usuario', function (req, res) {
//   let body=req.body;
//   res.json({body});
// })

//lo anterior lo probamos en postman con GET localhost/usuario
//Y si cambio ahora a un POST????

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






app.listen(3000,()=>{
  console.log(`Escuchando puerto 3000`);
  
})