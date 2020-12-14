const express = require('express')
//import express from 'express';
const bcrypt = require('bcrypt');
const {verificaToken,verificaAdminRol}=require('../middlewares/autenticacion');

//const _ =require('underscore');

const Usuario = require('../models/usuario');

const app = express();

app.post('/usuario', [verificaToken,verificaAdminRol], (req, res)=> {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //usuarioDb.password=null;
        return res.json({
            ok: true,
            usuarioDb
        })
    })
});

app.put('/usuario/:id',[verificaToken,verificaAdminRol], (req, res)=> {
    let id = req.params.id;
    let body = req.body;

    // Usuario.findById(id, (err, usuarioDB) => {
    //    //usuarioDB.save        
    // })

    const usuarioEditado = {};
    const keysValidas=['nombre','email','img','role','estado'];
    Object.keys(body).forEach(key => {        
        if(keysValidas.includes(key))
            usuarioEditado[key]=body[key];
    });    
    //let body =  _.pick(req.body,['nombre','email','img','role','estado']); //esto seria usando underscore

    Usuario.findByIdAndUpdate(id, usuarioEditado, {new:true,runValidators:true, context: 'query' },(err, usuarioDB) => {
        //mas rapido 
        //aqui no podemos obtener un error si el id existe
        //se pierde un poco de funcionalidad, y al frontend el tocaria trabajar un poco mas
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok:true,
            usuario:usuarioDB
        })
    })

});

// app.get('/usuario/:desde/:limite', function (req, res) {
app.get('/usuario',verificaToken,  (req, res)=> {
    let desde=req.query.desde || 0;
    desde=Number(desde);
    let limite=req.query.limite || 5;
    limite=Number(limite);

    // let desde =Number(req.params.desde);
    // let limite = Number(req.params.limite);

    Usuario.find({estado:true},'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err,usuarios)=>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            // res.json({
            //     ok:true,
            //     usuarios
            // })

            Usuario.countDocuments({estado:true},(err,totalRegistros)=>{
                res.json({
                    ok:true,
                    usuarios,
                    totalRegistros
                })
            })

        })
})

// app.delete('/usuario/:id', function (req, res) {
//     let id =req.params.id;

//     Usuario.findByIdAndRemove(id,(err,usuarioEliminado)=>{
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             })
//         }

//         if(!usuarioEliminado){
//             return res.status(400).json({
//                 ok: false,
//                 err:{
//                     message:'Usuario no encontrado'
//                 }
//             })
//         }
//         res.json({
//             ok:true,
//             usuarioEliminado
//         })
//     })
// })

app.delete('/usuario/:id', [verificaToken,verificaAdminRol], (req, res)=> {
    let id =req.params.id;

    Usuario.findByIdAndUpdate(id, {estado:false}, {new:true,context: 'query' },(err, usuarioEliminado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!usuarioEliminado){
            return res.status(400).json({
                ok: false,
                err:{
                    message:'Usuario no encontrado'
                }
            })
        }
        res.json({
            ok:true,
            usuarioEliminado
        })
    })
})

module.exports = app;