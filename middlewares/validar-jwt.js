const jwt = require('jsonwebtoken');

const { response, request } = require('express');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token-auth');

    //validamos si viene el token, si no viene sacamos al usuario de la ruta y no puede hacer lo que la ruta sea que haga
    if (!token) {
        return res.status(401).json({
            msg: 'Token ausente y/o incorrecto'
        })
    }
    try {
        // verificamos que uid tenga un token de autenticacion valido
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        // buscamos el usuario en la DB 
        const usuario = await Usuario.findById(uid);
        //verificar que el usuario exista en la DB
        if (!usuario) {
            return res.status(401).json({
                msg: 'El token no corresponde a un usuario activo'
            })
        }
        // verificamos que el uid tenga estado en true, para que no pueda  hacer login un user borrado o con estado:false

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'El token no corresponde a un usuario activo'
            })
        }
        req.usuario = usuario;



        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });

    }

}




module.exports = { validarJWT }