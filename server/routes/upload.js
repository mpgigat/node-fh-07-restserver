const express = require('express')
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');


app.use(fileUpload({ useTempFiles: true }));

//EJEMPLO INICIAL
app.put('/upload', (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }
    let archivo = req.files.archivo;

    let extArchivoSplit = archivo.name.split('.');
    let extArchivo = extArchivoSplit[extArchivoSplit.length - 1];
    //EXTENCIONES VALIDAS
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if (extencionesValidas.indexOf(extArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extenciones permitidas son ' + extencionesValidas.join(', '),
                extencionEnviada: extArchivo
            }
        })
    }


    archivo.mv(`uploads/${archivo.name}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Imagen subida correctamente'
        });
    });

});


const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
//const Usuario=require('./producto');

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    //validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos permitidos son ${tiposValidos.join(', ')}`
            }
        })
    }

    let archivo = req.files.archivo;

    let extArchivoSplit = archivo.name.split('.');
    let extArchivo = extArchivoSplit[extArchivoSplit.length - 1];
    //EXTENCIONES VALIDAS
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if (extencionesValidas.indexOf(extArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extenciones permitidas son ' + extencionesValidas.join(', '),
                extencionEnviada: extArchivo
            }
        })
    }

    //cambiar el nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extArchivo}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(tipo==='usuarios')
            imagenUsuario(id, res, nombreArchivo);
        else
            imagenProducto(id,res,nombreArchivo);
    });

});

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo,'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo,'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borrarArchivo(productoDB.img,'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })
    });
}

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo,'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo,'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioDB.img,'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    });
}

function borrarArchivo(nombreImagen,tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;