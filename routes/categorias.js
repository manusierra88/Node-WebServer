const { Router } = require('express');
const { check } = require('express-validator');


const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { idCategoriaExiste, roleValido } = require('../helpers/db-validator');

const { validarCampos } = require('../middlewares/validarCampos');
const {validarJWT} = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-role');

const router = Router();

//peticion get para ver todas las categorias- ruta pubica
router.get('/', obtenerCategorias)

//peticion get con id,para ver una categoria determinada- ruta publica

router.get('/:id',[
    check('id','ID no es válido').isMongoId(),
    check('id').custom( idCategoriaExiste),
    validarCampos
] ,obtenerCategoria)
//peticion post- para hacer una categoria - ruta privada

router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
] ,crearCategoria )
//peticion put con id, para actualizar una categoria - ruta privada
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre debe ser ingresado').not().isEmpty(),
    check('id').custom(idCategoriaExiste),
    validarCampos
],actualizarCategoria)
//peticion delet, para borrar una categoria por su id - ruta ADMIN
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id','ID no válido').isMongoId(),
    check('id').custom(idCategoriaExiste),
    validarCampos
],borrarCategoria)

module.exports = router