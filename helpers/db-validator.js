
const Categoria = require('../models/categoria');
const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const res = require('express/lib/response');

const roleValido = async (role = '') => {
    const roleExiste = await Role.findOne({ role });
    if (!roleExiste) {
        throw new Error(`El rol ${role} no es válido`);
    }
}

const emailExiste = async (correo = '') => {

    const correoExiste = await Usuario.findOne({ correo });
    if (correoExiste) {
        throw new Error(`Èl correo ${correo} ya se encuentra registrado y/o en uso`);
    }

}


const idUsuarioExiste = async (id) => {
    const idExiste = await Usuario.findById(id);
    if (!idExiste) {
        throw new Error(`El ID ${id} no existe y/o no es válido`);
    }
}

const idCategoriaExiste = async (id) => {
    const idExiste = await Categoria.findById(id);
    if (!idExiste) {
        throw new Error(`El id ${id}, no es correcto o no se encuentra en la base de datos`)
    }
}

const idProductoExiste = async (id) => {
    const idExiste = await Producto.findById(id);
    if (!idExiste) {
        throw new Error(`El id ${id}, no es correcto o no se encuentra en la base de datos`)
    }
}

const coleccionesPermtidas = (coleccion = '', colecciones = []) => {

    const incliuda = colecciones.includes(coleccion);

    if (!incliuda) {
        throw new Error(`La coleccioón ${coleccion} no está dentro de las colecciones guardadas en base de datos, (${colecciones})`)
    }

    return true;

}



module.exports = {
    roleValido,
    emailExiste,
    idUsuarioExiste,
    idCategoriaExiste,
    idProductoExiste,
    coleccionesPermtidas,

}


//esta función sirve para validar el role contra la base de datos y es pasada como parametro en el custom para que sea evaluada