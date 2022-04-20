

const {Router}= require ('express');
const {check} = require('express-validator');


const { cargarArchivo, actualizarImagen, mostrarImagen } = require('../controllers/uploads');

const { coleccionesPermtidas } = require('../helpers');

const { validarArchivoASubir, validarCampos } = require('../middlewares')

const router = Router();


router.post('/',validarArchivoASubir ,cargarArchivo);


router.put('/:coleccion/:id',[
    validarArchivoASubir,
    check('id','El ID no corresponde a Mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermtidas(c ,['usuarios', 'productos'])),
    validarCampos
],actualizarImagen);

router.get('/:coleccion/:id',[
    check('id','El ID no corresponde a Mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermtidas(c ,['usuarios', 'productos'])),
    validarCampos
],mostrarImagen)



module.exports = router;


