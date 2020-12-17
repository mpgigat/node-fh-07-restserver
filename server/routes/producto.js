const express = require('express')
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

let Producto = require('../models/producto');

app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email ')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            return res.json({
                ok: true,
                productos
            });
        });
});

app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Id no encontrado'
                    }
                })
            }

            return res.json({
                ok: true,
                producto: productoDB
            });
        });
});

app.get('/producto/buscar/:termino',verificaToken,(req,res)=>{
    let termino=req.params.termino;
    let regex=new RegExp(termino, 'i');//expresion regular //i insensible a mayu
    Producto.find({nombre:regex})
        .populate('categoria','nombre')
        .exec((err,productos)=>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                productos
            });
        });
})

app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    console.log('body', body);
    let producto = new Producto({
        usuario: req.usuario._id,
        categoria: body.categoria,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible
    });

    console.log('producto', producto);

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.status(201).json({
            ok: true,
            producto: productoDB
        })
    });
});

app.put('/producto/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    const productoEditado = {};
    const keysValidas = ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria', 'usuario'];
    Object.keys(body).forEach(key => {
        if (keysValidas.includes(key))
            productoEditado[key] = body[key];
    });

    Producto.findByIdAndUpdate(id, productoEditado, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
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
            ok: true,
            usuario: productoDB
        })
    })

});

//de esta forma hay que enviar todo
// app.put('/producto/:id', verificaToken, (req, res) => {
//     let id = req.params.id;
//     let body = req.body;

//     Producto.findById(id, (err, productoDB) => {
//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 err
//             })
//         }

//         if (!productoDB) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'El producto no existe'
//                 }
//             })
//         }

//         productoDB.categoria = body.categoria,
//             productoDB.nombre = body.nombre,
//             productoDB.precioUni = body.precioUni,
//             productoDB.descripcion = body.descripcion,
//             productoDB.disponible = body.disponible

//         productoDB.save((err, productoGuardado) => {
//             if (err) {
//                 return res.status(500).json({
//                     ok: false,
//                     err
//                 })
//             }

//             return res.json({
//                 ok: true,
//                 producto: productoGuardado
//             })
//         });


//     });
// });

app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrad'
                }
            })
        }

        productoDB.disponible = false;

        productoDB.save((err, productoEliminado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoEliminado ,//o
                err: {
                    message: 'producto Eliminado'
                }
            })
        });


    })

});

module.exports = app;