const express = require('express')
//import express from 'express';
const mongoose = require('mongoose')
//import mongoose from 'mongoose';
const app = express();

require('./config/config');

app.use(express.urlencoded({extended:false}));

app.use(require('./routes/usuario'));

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.URLDB,{useNewUrlParser: true,useUnifiedTopology: true }, (err,res)=>{
  if(err) throw err;
  console.log('Base de datos Online');
});

app.listen(process.env.PORT,()=>{
  console.log(`Escuchando puerto 3000`);
  
})