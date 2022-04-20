//podemos crear una clase para poder trabajar con express de forma mas ordenada en el app.js
//basicamente la clase tiene todo lo que normalmente encontramos en la app.js pero dentro de una clase
//luego llamamos creamos una instancia de la clase en el app.js para poder obtener las funcionallidades de la clase

const express = require('express');
const cors = require('cors');

const fileUpload = require('express-fileupload');


const { dbConnection } = require('../database/config');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.authPath = '/api/auth';
        this.buscarPath = '/api/buscar';
        this.categoriasPath = '/api/categorias';
        this.productosPath = '/api/productos';
        this.uploadsPath = '/api/uploads'
        this.usuariosPath = '/api/usuarios'


        //conexion DB

        this.conectarDB();

        //middleweares



        this.middlewares();

        // routes
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }


    middlewares(){
        this.app.use(express.static('public'));
        //al tener un archivo index.html en ese directorio ejecuta primero ese, haciendo que el directorio raiz /
        //no sea ejecutado, si lo va a hacer cuando en la carpeta public no tenga archivos html
        this.app.use(express.json()); //lectura y parse del body

        //CORS
        this.app.use(cors());

        //FILEUPLOAD - Carga de archivos

        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true,
        })
        );


    }


    routes(){
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.buscarPath, require('../routes/buscar'));
        this.app.use(this.categoriasPath, require('../routes/categorias'));
        this.app.use(this.productosPath, require('../routes/productos'));
        this.app.use(this.uploadsPath, require('../routes/uploads'));
        this.app.use(this.usuariosPath, require('../routes/user'));
    }// la config del path usando el router la definimos aca,por eso en la definicion de las rutas solo ponemos '/'
    //creamos un propiedad que contenga el path donde va a estar las rutas de usuarios y la pasamos con el this.
    //asi si algun dia cambiamos el path, solo modificamos la declaracion de la propiedad y listo.


    listen(){
        this.app.listen(this.port, ()=>{
            console.log('servidor corriendo en puerto ', this.port);
        })
    }

}




module.exports = Server;
