const { validationResult } = require("express-validator")


const validarCampos = (req,res, next)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }
    next();
    //la funcion next se pasa como parametro para que cuando todos los middlewares de chequeo vaya chequeando
    // y pasen al siguiente, si ya no quedan mas chequeos ahi pasa al controlador y se hace la peticion a la ruta
    // solicitada, siempre que todas las validaciones hayan sido correctas
}



module.exports = {validarCampos}

//---- CHEQUEO DE ERRORES QUE VENGAN DE LOS MIDDLEWARES PRESENTES EN LA  O LAS RUTAS 
//const errors = validationResult(req);

//if(!errors.isEmpty()){
//   return res.status(400).json(errors);
//}//esta constante almacena los errores de los check que haya como middlewares y los envia segun vayan surgiendo
