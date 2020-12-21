const jwt =require('jsonwebtoken');

//VERIFICAR TOKEN
let verificaToken=(req,res,next)=>{
    let token=req.get('token');

    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:"Token no válido"
                }
            })
        }
        req.usuario=decoded.usuario;
        next();
    });    
}

//VERIFICA ROL ADMINISTRADOR
let verificaAdminRol=(req,res,next)=>{
    let usuario=req.usuario;
    if(usuario.role==='ADMIN_ROLE'){
        next();
    }else{
        return res.json({
            ok:false,
            err:{
                message:'El usuario no es administrador'
            }
        });
        next();
    }
}

//OTRO PARA PODER LLAMARLO DESDE HTML, DIRECTO DESDE UNA IMAGEN
let verificaAdminImg=(req,res,next)=>{
    let token=req.query.token;
    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:"Token no válido"
                }
            })
        }
        req.usuario=decoded.usuario;
        next();
    });   
}

module.exports={verificaToken,verificaAdminRol,verificaAdminImg};