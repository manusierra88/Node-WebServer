const { response } = require("express");


const validarArchivoASubir = (req, res = response, next) => {

    //! cortamos la comprobacion de que el archivo no sea undefined de la funcion del controlador para hacer un middleware
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: 'No hay archivos agregados'
        });


    }
    next();
}


module.exports = {
    validarArchivoASubir
}