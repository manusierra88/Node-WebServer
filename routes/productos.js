


const { Router } = require('express');
const { check } = require('express-validator');



const { idCategoriaExiste, roleValido, idProductoExiste } = require('../helpers/db-validator');

const { validarCampos } = require('../middlewares/validarCampos');
const {validarJWT} = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-role');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');

const router = Router();


router.get('/', obtenerProductos);

router.get('/:id',[
    check('id','El ID no es válido').isMongoId(),
    check('id').custom(idCategoriaExiste),
    validarCampos
],obtenerProducto);

router.post('/',[
    validarJWT,
    check('nombre', 'El nombre deber ser ingresado').not().isEmpty(),
    check('categoria','No es un ID válido').isMongoId(),
    check('categoria').custom(idCategoriaExiste),
    validarCampos
],crearProducto);

router.put('/:id',[
    validarJWT,
    check('id','El ID no es válido').isMongoId(),
    check('id').custom(idProductoExiste),
    validarCampos
], actualizarProducto);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(idProductoExiste),
    validarCampos
],borrarProducto);

module.exports = router