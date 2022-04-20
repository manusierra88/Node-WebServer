
const { response } = require("express");
const fs = require('fs');
const path = require('path');




const { subirArchivo } = require("../helpers");
const Producto = require("../models/producto");
const Usuario = require("../models/usuario");


const cargarArchivo = async (req, res = response) => {
    //! sacamos el if que comprueba que el archivo tiene contenido y lo pasamos al middleware para poder reutilizarlo en otras partes

    try {
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        //archivo-- extension --- carpeta donde se va a guardar
        res.json({ nombre })

    } catch (error) {
        res.json({ error });
    }

}


const actualizarImagen = async (req, res = response) => {
    const { coleccion, id } = req.params;

    let modelo;

    //* switch para comprobar que el id enviado pertenezca a la coleccion enviada como parametro

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `El id ${id} no corresponde a un usuario activo y/o registrado`
                });
            }


            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `El id ${id} no corresponde a un producto registrado en la base de datos`
                });
            }


            break;
        default:
            return res.status(500).json({ msg: 'Opción de colección no validada, contactese con el desarrollador' })

    }

    try {
        //* Limpiar imagenes previamente cargadas
        if (modelo.img) {
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }

    } catch (error) {

        console.log(error);

    }


    const nombre = await subirArchivo(req.files, undefined, coleccion);

    modelo.img = nombre;

    await modelo.save();
    res.json({
        modelo
    })


}


const mostrarImagen = async (req, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    //* switch para comprobar que el id enviado pertenezca a la coleccion enviada como parametro

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `El id ${id} no corresponde a un usuario activo y/o registrado`
                });
            }


            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `El id ${id} no corresponde a un producto registrado en la base de datos`
                });
            }


            break;
        default:
            return res.status(500).json({ msg: 'Opción de colección no validada, contactese con el desarrollador' })

    }

    try {
        //vemos en el path si hay una imagen y pasamos el path como un sendFile para que muestre la imagen en el GET
        if (modelo.img) {
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen);
            }
        }

    } catch (error) {

        console.log(error);

    }

    //si no hay una imagen mandamos 
    const pathNoImagen = path.join(__dirname,'../assets/no-image.jpg');
    
    res.sendFile(pathNoImagen);

}






module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen

}