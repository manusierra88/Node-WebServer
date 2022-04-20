
const { Router } = require('express');
const { check } = require('express-validator');



const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validarCampos');


const router = Router();



router.post('/login', [
    check('correo', 'El correo es un campo obligatorio').isEmail(),
    check('password', 'La contraseña es un campo obligatorio').not().isEmpty(),
    validarCampos],
    login);

router.post('/google',[
    check('id_token', 'Token de google es necesario').not().isEmpty(),
    validarCampos],
    googleSignIn)


module.exports = router;
