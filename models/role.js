const {Schema, model}= require('mongoose');

const RoleSchema = Schema({

    role : {
        type : String,
        required : [true, 'El rol es un campo requerido'],
        default : "USER_ROLE"
    }
    
});



module.exports = model('role', RoleSchema);

//esquema del role para comprobar el rol del usuario pero contra la DB