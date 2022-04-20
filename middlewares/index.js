

const validarArchivo = require('./validar-archivo');
const validarCampos = require('./validarCampos');
const validarJWT = require('./validar-jwt');
const validarRole = require('./validar-role');

module.exports = {
    ...validarArchivo,
    ...validarCampos,
    ...validarJWT,
    ...validarRole,
}