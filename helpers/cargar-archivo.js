const path = require('path');
const { v4: uuidv4 } = require('uuid');



const subirArchivo = (files, extensionesValidas = ['jpg', 'jpeg', 'png', 'gif'], carpeta = '') => {
    return new Promise((resolve, reject) => {
        const { archivo } = files;
        const nombreArchivoSplit = archivo.name.split('.') //cortamos el nombre por cada caracter que sea un .
        const extensionArchivo = nombreArchivoSplit[nombreArchivoSplit.length - 1];
        
        if (!extensionesValidas.includes(extensionArchivo)) {

            return reject(`El formato ${extensionArchivo}, no es una extensión soportada por el servidor, debe ser de los siguientes formatos: ${extensionesValidas}`)
        }

        const nombreArchivoCargado = uuidv4() + '.' + extensionArchivo;

        uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreArchivoCargado);

        archivo.mv(uploadPath, (err) => {
            if (err) {

                reject(err);
            }

            resolve(nombreArchivoCargado);
        });

    })
}




module.exports = {
    subirArchivo
}