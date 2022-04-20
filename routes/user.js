//podemos hacer uso de router para pasar la logica de las rutas a este archivo para que el server.js
//quede mas limpio y ordenado por ende mas facil de mantener y escalar.
// en este caso serian las rutas que maneja a un hipotetio usuario, por eso user.js

const {Router} =  require('express');
const { check } = require('express-validator');
const router = Router();

const { roleValido, emailExiste, idUsuarioExiste } = require('../helpers/db-validator');

const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-role');

const { usuariosGet, usuarioPost, usuarioPut, usuarioDelet, usuarioPatch } = require('../controllers/user');


//en el '/' path solo mandamo la raiz, dado que en la parte del server.js vamos a determinar la ruta real a la que vamos
//a realizar la peticion correspondiente
//la request, response es pasada como referencia en la funcion ususarioGet o la que sea llamada como referencia.
//no la ejecuto 
router.get('/', usuariosGet);

router.post('/',[
    check('correo', 'El mail ingresado no es válido').isEmail(),
    check('correo').custom(emailExiste),
    check('nombre', 'El nombre es un campo obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener como mínimo 6 carateres ').isLength({min:6}),
   // check('role', 'Ese es no es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( roleValido ), 
    validarCampos
] ,usuarioPost); //pasamos como middleware la funcion check de express-validator que va a generar los erros si es que los hay
//en los campos del usuario que deseamos chequear para que sean guardados correctamente en la DB

router.put('/:id',[
    check('id','El ID no es válido').isMongoId(),
    check('id').custom( idUsuarioExiste ),
    check('role').custom( roleValido),
    validarCampos
], usuarioPut);//el :id seria un parametro que defino y paso para que el valor que coincida con
//el parametro pasado sea devuelto

router.patch('/', usuarioPatch);

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id','El ID no es válido').isMongoId(),
    check('id').custom( idUsuarioExiste ),
    validarCampos
    
] ,usuarioDelet);




module.exports = router;