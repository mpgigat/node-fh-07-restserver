const express = require('express')
const mongoose = require('mongoose')
require('./config/config');

const app = express();

app.use(express.urlencoded({extended:false}));

const path=require('path');
app.use(express.static(path.resolve(__dirname,'../public')));

//configuracion global de rutas
app.use(require('./routes/index'));

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.URLDB,{useNewUrlParser: true,useUnifiedTopology: true }, (err,res)=>{
  if(err) throw err;
  console.log('Base de datos Online');
});

app.listen(process.env.PORT,()=>{
  console.log(`Escuchando puerto 3000`);
  
})