const {Schema, model}= require('mongoose');

const ProductoSchema = Schema({

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
    },
    categoria:{
        type : Schema.Types.ObjectId,
        ref : 'Categoria',
        required : true
    },
    precio :{
        type : Number,
        default : 0
    },
    descripcion : {
        type : String,
        
    },
    disponibilidad :{
        type: Boolean,
        default : true
    },
    img : {
        type : String
    }
    
});

ProductoSchema.methods.toJSON = function(){
    const {__v, estado, ...data} = this.toObject();
    return data;
}



module.exports = model('Producto', ProductoSchema);

//esquema del role para comprobar el rol del usuario pero contra la DB