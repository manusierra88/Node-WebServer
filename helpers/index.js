

const subirArchivo = require('./cargar-archivo');
const dbValidators = require('./db-validator');
const generarJWT = require('./generador-jwt');
const googleVerify = require('./google-verify');


module.exports = {

    ...subirArchivo,
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,

}