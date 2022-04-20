const {Schema, model}= require('mongoose');

const CategoriaSchema = Schema({

    nombre : {
        type : String,
        required : [true, 'El nombre es un campo requerido'],

    },
    estado : {
        type : Boolean,
        default : true,
        required : true
    },
    usuario: {
        type : Schema.Types.ObjectId,  //creamos una relaacion de colecciones, relacionamos la cateogoria con la de usuarios
        ref : 'Usuario',               //para saber que usuario fue el que creo esa categoria o hizo alguna modificacion
        required : true 
    }
    
});

CategoriaSchema.methods.toJSON = function(){
    const {__v, estado, ...data} = this.toObject();
    return data;
}



module.exports = model('Categoria', CategoriaSchema);

//esquema del role para comprobar el rol del usuario pero contra la DB