

const {Schema, model} = require('mongoose');

// creamos el schema de usuario con las propiedades que va a tener y van a ser guardadas en la coleccion

const UsuarioSchema = Schema({
    nombre : {
        type : String,
        required : [true, 'El nombre es un campo obligatorio']
    },
    correo : {
        type : String,
        required : [true, 'El correo es un campo obligatorio'],
        unique : true
    },
    password : {
        type : String,
        required : [true, 'La contraseña es un campo obligatorio']
    },
    img : {
        type : String
    },
    role: {
        type : String,
        required : true,
        emun : ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado : {
        type : Boolean,
        default : true
    },
    google : {
        type : Boolean,
        default : false
    },
    
})


UsuarioSchema.methods.toJSON = function(){
    const {__v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id; // extraemos el _id para que no sea enviado en la respuesta y lo igualamos a usuario.uid y si enviamos uid
    return usuario;
}
//metodo que sirve para en la respuesta no sea vista la contraseña 



module.exports =  model('Usuario', UsuarioSchema); //exportamos el schema y el 'Usuario', que va a crear la coleecion
// 'Usuarios'
