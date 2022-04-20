const bcryptjs = require('bcryptjs');
const { response } = require('express');

const { generarJWT } = require('../helpers/generador-jwt');
const { googleVerify } = require('../helpers/google-verify');

const Usuario = require('../models/usuario');


const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });

        //comprobar que el correo exista
        if (!usuario) {
            return res.status(400).json({
                msg: 'El correo / contraseña no son correctos -correo',
            });
        }
        //comprobar el estado del ususario
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El correo / contraseña no son correctos -estado:false'
            });
        }
        //comprobar que la contraseña sea valida
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'El correo / contraseña no son correctos -password'
            });
        }

        //JWT (json web token)

        const token = await generarJWT(usuario.id)
        res.json({
            usuario,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo ocurrio, comuniquese con el administrador'
        });
    }

}


const googleSignIn = async (req, res) => {

    const { id_token } = req.body;

    try {

        const {nombre, correo, img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo}) // compruebo que el usuario no este registrado previamente en la DB

        if(!usuario){
            // si el usuario no existe debo crearlo
            const data = {
                nombre,
                correo,
                img,
                password : '-',
                google : true,
                role : 'USER_ROLE'
            }
            //genero la nueva instancia de usuario con el modelo de Uuario

            usuario = new Usuario(data); // paso la data que viene de google para que complete los campos de modelo de usuario
            //lo guardo en DB
            await usuario.save();
        }


        if(!usuario.estado){ //si el estado de un usuario ya existente en DB esta en false, le puedo negar el acceso
            return res.status(401).json({
                ok : false,
                msg : 'Usuario no posee acceso a la aplicación, hable con el administrador',
            })
        }

        // generamos el JWT

        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);

        res.status(400).json({
            msg:'error'
        })

    }


}

module.exports = {
    login,
    googleSignIn

}