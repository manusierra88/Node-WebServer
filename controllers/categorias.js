
const { response, request, query } = require('express');

const Categoria = require("../models/categoria");




//get de categorias

const obtenerCategorias = async (req = request, res = response) => {
    const { limite, desde } = req.query;

    const [categorias, total] = await Promise.all([
        Categoria.find()
            .populate('usuario', 'nombre')
            .limit(Number(limite))
            .skip(Number(desde)),
        Categoria.countDocuments()
    ])

    res.json({
        total,
        categorias
    })
}

//obtener categoria por id

const obtenerCategoria = async (req, res) => {
    const id = req.params.id;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.status(200).json({
        categoria
    })

}
//post categoria con id del usuario que lo creo
const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    //corroboramos que la categoria no exista previamente en la DB

    if (categoriaDB) {
        return res.status(401).json({
            msg: `La categoría ${categoriaDB.nombre} ya existe en la base de datos`
        });
    } //msje de error por si la categoria ya fue creada previamente

    // generamos la data que va a completar el modelo de la categoria en la DB

    const data = {
        nombre,
        usuario: req.usuario._id
    }
    //pasamos la data al modelo 

    const categoria = new Categoria(data);
    //guardo en DB
    await categoria.save();

    res.status(201).json(categoria);


}

// actualizar categoria- ruta privada

const actualizarCategoria = async (req, res) => {

    const id = req.params.id;

    const { usuario, estado, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id //obtengo la info del usuario que esta actualizando la categoria

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json(categoria);


}

//delet categoria- solo usuarios con ADMIN_ROLE

const borrarCategoria = async (req, res) => {

    const id = req.params.id;

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });
    res.json(categoriaBorrada);

}








module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}