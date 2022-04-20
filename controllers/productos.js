

const { request, response } = require('express');


const Producto = require('../models/producto');

//get 

const obtenerProductos = async (req = request, res = response) => {

    const { limite, desde } = req.query;

    const [productos, total] = await Promise.all([
        Producto.find(req.query)
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre')
            .limit(Number(limite))
            .skip(Number(desde)),
        Producto.countDocuments()
    ])
    res.json({
        total,
        productos
    })
}

const obtenerProducto = async (req, res) => {
    const id = req.params.id;

    const producto = await Producto.findById(id).populate('categoria', 'nombre');
    res.status(200).json(producto);

}

const crearProducto = async (req, res) => {
    const { estado, usuario, ...body } = req.body;
    const nombre = req.body.nombre.toUpperCase();

    const productoDB = await Producto.findOne({ nombre });
    if (productoDB) {
        return res.status(401).json({
            msg: `El producto ${productoDB.nombre} ya se encuentra registrado en la base de datos`
        });
    }

    const data = {
        ...body,
        nombre: req.body.nombre.toUpperCase(),
        usuario: req.usuario._id,

    }

    const producto = new Producto(data);

    await producto.save();

    res.status(201).json(producto);
}

const actualizarProducto = async (req, res) => {
    const id = req.params.id

    const { usuario, estado, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }


    data.usuario = req.usuario._id;

    const productoActualizado = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json(productoActualizado);

}


const borrarProducto = async (req, res) => {
    const id = req.params.id;

    const productoBorrar = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });
    res.json(productoBorrar);
}



module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}