const { response } = require("express");
const { ObjectId } = require('mongoose').Types;



const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
]

const buscarUsuarios = async (termino = '', res) => {
    const idMongo = ObjectId.isValid(termino)

    if (idMongo) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i'); // generamos una expresion regular en donde evaluamos que el termino sea insensible a mayus o minuscula

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    }) // usamos criterios de buscqueda que tiene mongo y hacemos que si envia el correo o el nombre lo igualamos a la regex para 
    //obtener los resultados, y ponemos como criterio de busqueda que solo devuelva los usuarios con estado en true
    //usando el and para que se ajuste a ese criterio.
    res.json(usuarios);
}

const buscarCategorias = async (termino = '', res) => {
    
    const idMongo = ObjectId.isValid(termino);

    if(idMongo){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results : (categoria) ? [categoria] : []
        });
    }
    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({ nombre:regex});
    res.json(categorias);
}

const buscarProductos = async (termino = '', res) => {

    const idMongo = ObjectId.isValid(termino);

    if(idMongo){
        const producto = Producto.findById(termino);
        return res.json({
            results : (producto) ? [producto] : []
        });
    }
    const regex = new RegExp(termino,'i');
    const productos = await Producto.find({nombre : regex});

    res.json(productos);

}

const buscar = (req, res = response) => {


    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas para buscar son : ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);

            break;
        case 'usuarios':
            buscarUsuarios(termino, res);

            break;
        case 'productos':
            buscarProductos(termino, res);

            break;


        default:
            res.status(500).json({
                msg: 'Error en la base de busquedas, parametro no definido'
            })
            break;
    }
}



module.exports = {
    buscar
}