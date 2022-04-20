//podemos crear los metodos controladores como funciones en este archivo y luego pasar la referencia
//de las funciones en el callback de la ruta que hayamos creado.


const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario'); //llamamos el modelo de usuario para poder crear una nueva instancia
const { validationResult } = require('express-validator');

//este seria el controlador de la ruta GET para las rutas de ususarios en user.js(detntro de routes)
const usuariosGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    /*
        const usuarios = await Usuario.find()
            .limit(Number(limite))//podemos definir el limite de retorno del GET usando el limimt como query
            .skip(Number(desde));// podemos definir desde que indice del arreglo de usuarios retornamos definiendo el skip
        const usuariosTotales = await Usuario.countDocuments();
    */
    //otra forma de hacer esto es usando el Promise.all el cual toma un arreglo de promesas y las ejecuta a todas juntas
    //bajando el tiempo de respuesta de nustro servidor, si una falla, fallan todas las promesas.
    //como es un arreglo, tmb se puede desestruturar usando [] y pasando nombres a cada promesa en los indices que querramos

    const [usuarios, total] = await Promise.all([
        Usuario.find()
            .limit(limite)
            .skip(desde),
        Usuario.countDocuments()

    ]);

    res.json({
        total,
        usuarios

    });
}

const usuarioPost = async (req, res) => {


    const { nombre, password, role, correo } = req.body; //obtengo la info en este metedo, tmb puede ser en put delete
    //podemos desestructurar el body con los parametros que solo queremos usar
    // const {nombre,edad} = req.body;

    const usuario = new Usuario({ nombre, password, role, correo }); //creamos la instancia de usuario, pasando lo que venga en el body
    //verificar si existe correo

    //encriptar password
    const salt = bcryptjs.genSaltSync();//genera la cantidad de complejidad para la encriptacion 
    usuario.password = bcryptjs.hashSync(password, salt); // al campo pass le aplicamos la encriptacion

    //guardar en DB

    await usuario.save();

    res.json({
        msg: 'Peticion POST - con controlador',
        usuario

    });
}

const usuarioPut = async (req, res) => {
    const id = req.params.id;
    const { password, correo, google, ...restoData } = req.body;
    //validar password
    if (password) {
        //volvemos a hacer el hash a la contraseña
        const salt = bcryptjs.genSaltSync();
        restoData.password = bcryptjs.hashSync(password, salt);
    }
    const usuario = await Usuario.findByIdAndUpdate(id, restoData);
    res.json({
        msg: 'Peticion PUT - con controlador',
        usuario
    });
}

const usuarioPatch = (req, res) => {
    res.json({
        msg: 'Peticion PATCH -  con controlado'
    });
}

const usuarioDelet = async (req, res) => {
    const id = req.params.id;
    //borrar de forma fisica el ususario en DB
    // const ususario = await Usuario.findbyIdAndDelete(id);--- esto borra el registro de nuestro usuario por completo

    //lo recomendado es hace un update del estado, pasando de true a false haciendo que los que consuman el REST-Server no vean
    //el usuario pero quede registrado igualmente en la DB

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    const usuarioAutenticado = req.usuario;

    res.json(usuario);
}

module.exports = {
    usuariosGet,
    usuarioPost,
    usuarioPut,
    usuarioPatch,
    usuarioDelet
}