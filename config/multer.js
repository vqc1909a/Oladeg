import * as url from 'url';
import multer from "multer";
import path from "path";
import shortid from "shortid";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// Es importante tener en cuenta que multer.memoryStorage puede ser útil para cargas temporales y reducir la carga en el sistema de archivos del servidor, pero puede no ser adecuado si necesitas manejar archivos grandes o múltiples simultáneamente, ya que puede afectar el rendimiento y el uso de memoria del servidor.

// En resumen, multer.diskStorage guarda los archivos en el disco y es útil cuando necesitas acceder a los archivos posteriormente, mientras que multer.memoryStorage almacena los archivos en memoria y es adecuado para operaciones en memoria o para cargas temporales que no requieren persistencia en el disco.

export const storageAnuncios = multer.diskStorage({
  // La función cb acepta dos parámetros: error y destino.
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/dist/uploads/anuncios/'));
  },
  filename: (req, file, cb) => {
    // {
    //   file: {
    //     fieldname: 'imagen',
    //     originalname: 'adventure-time-dark-souls-theme.jpg',
    //     encoding: '7bit',
    //     mimetype: 'image/jpeg'
    //   }
    // }
    const fileArray = file.originalname.split('.');
    const fileExtension = fileArray[fileArray.length - 1];
    const fileName =  fileArray[fileArray.length - 2]
    const allowedExtensions = /jpeg|jpg|png|gif/i;
    const isImage = allowedExtensions.test(fileExtension) && allowedExtensions.test(file.mimetype);
    if(isImage){
      const fullName = fileName + '-' + shortid.generate() + '.' + fileExtension;
      cb(null, fullName)
    }else{
        cb(new Error('El archivo no es un tipo de imagen válido'))
    }
  }
});

export const storageProfiles = multer.diskStorage({
  // La función cb acepta dos parámetros: error y destino.
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/dist/uploads/profiles/'));
  },
  filename: (req, file, cb) => {
    // {
    //   file: {
    //     fieldname: 'imagen',
    //     originalname: 'adventure-time-dark-souls-theme.jpg',
    //     encoding: '7bit',
    //     mimetype: 'image/jpeg'
    //   }
    // }
    const fileArray = file.originalname.split('.');
    const fileExtension = fileArray[fileArray.length - 1];
    const fileName =  fileArray[fileArray.length - 2]
    const allowedExtensions = /jpeg|jpg|png|gif/i;
    const isImage = allowedExtensions.test(fileExtension) && allowedExtensions.test(file.mimetype);
    if(isImage){
      const fullName = fileName + '-' + shortid.generate() + '.' + fileExtension;
      cb(null, fullName)
    }else{
        cb(new Error('El archivo no es un tipo de imagen válido'))
    }
  }
});

export const storageProgramasAcademicos = multer.diskStorage({
  // La función cb acepta dos parámetros: error y destino.
  destination: (req, file, cb) => {
    let folder = ''
    if(file.fieldname === 'portada'){
      folder = path.join(__dirname, '../public/dist/uploads/programas/portada/')
    }else if(file.fieldname === 'expositorImagen'){
      folder = path.join(__dirname, '../public/dist/uploads/programas/expositor/')
    }else if(file.fieldname === 'certificado'){
      folder = path.join(__dirname, '../public/dist/uploads/programas/certificado/')
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // {
    //   file: {
    //     fieldname: 'imagen',
    //     originalname: 'adventure-time-dark-souls-theme.jpg',
    //     encoding: '7bit',
    //     mimetype: 'image/jpeg'
    //   }
    // }
    const fileArray = file.originalname.split('.');
    const fileExtension = fileArray[fileArray.length - 1];
    const fileName =  fileArray[fileArray.length - 2]
    const allowedExtensions = /jpeg|jpg|png|gif/i;
    const isImage = allowedExtensions.test(fileExtension) && allowedExtensions.test(file.mimetype);
    if(isImage){
      const fullName = fileName + '-' + shortid.generate() + '.' + fileExtension;
      cb(null, fullName)
    }else{
        cb(new Error('El archivo no es un tipo de imagen válido'))
    }
  }
})




export const storageLibros = multer.diskStorage({
  // La función cb acepta dos parámetros: error y destino.
  destination: (req, file, cb) => {
    let folder = ''
    if(file.fieldname === 'portada'){
      folder = path.join(__dirname, '../public/dist/uploads/libros/portada/')
    }else if(file.fieldname === 'archivo'){
      //De esta manera evitamos la carga de un archivo
      if (req.files.archivo) {
        folder = path.join(__dirname, '../public/dist/uploads/libros/archivo/')
      }
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    if(file.fieldname === 'portada'){
      const fileArray = file.originalname.split('.');
      const fileExtension = fileArray[fileArray.length - 1];
      const fileName =  fileArray[fileArray.length - 2]
      const allowedExtensions = /jpeg|jpg|png|gif/i;
      const isImage = allowedExtensions.test(fileExtension) && allowedExtensions.test(file.mimetype);
      if(isImage){
        const fullName = fileName + '-' + shortid.generate() + '.' + fileExtension;
        cb(null, fullName)
      }else{
          cb(new Error('El archivo no es un tipo de imagen válido'))
      }
    }else if(file.fieldname === 'archivo'){
       //De esta manera evitamos la carga de cua1qluier archivo
       if (req.files.archivo) {
        const fileArray = file.originalname.split('.');
        const fileExtension = fileArray[fileArray.length - 1];
        const fileName =  fileArray[fileArray.length - 2]
        const allowedExtensions = /pdf|doc|docx|xls|xlsx/i; // Permitir PDF, Word y Excel
        const isAllowedExtension = allowedExtensions.test(fileExtension);
        if (isAllowedExtension) {
          const fullName = fileName + '-' + shortid.generate() + '.' + fileExtension;
          cb(null, fullName);
        } else {
          cb(new Error('El archivo no es un tipo permitido (PDF, Word o Excel)'));
        }
       }
    }
  }
})