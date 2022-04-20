require('dotenv').config();


const Server = require('./models/server');



const server = new Server();



server.listen();


/*esta app sirve como un web-server y rest server con rutas y controladores de rutas desentralizadas para mejorar
la organizacion y la escalabilidad de la app, tambien se puede usar como base para nuevos proyectos e ir 
modificando el codigo segun sea necesario*/
