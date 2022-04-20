const { response, request } = require('express');


const esAdminRole = (req = request, res = response, next) => {
    //verificamos que el usuario sea valido
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'El usuario no es válido y no es posible verificar el token'
        });
    }

    const { role, nombre } = req.usuario;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `El usuario: ${nombre}, no tiene autorización para realizar dicha petición`
        });
    }



    next();
}


const tieneRole = (...roles) => {
    return (req, res, next) => {
        const { role, nombre } = req.usuario;
        //verificamos un usuario válido 
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'El usuario no es válido y no es posible verificar el token'
            });
        }
        //comprobamos el rol que tiene el usuario en base a los argumentos que enviemos cuando llamamos la funcion (role)
        if (!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                msg: `El usuario ${nombre}, tiene un rol ${role} que no le permite realizar dicha petición`
            })
        }

        next();
    }
}


module.exports = {
    esAdminRole,
    tieneRole
}