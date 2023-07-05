import * as url from 'url';
import Sequelize from "sequelize";
import path from "path";
import { validationResult } from "express-validator";
import multer from "multer";
import fse from "fs-extra";
import {DateTime} from "luxon";
import { storageAnuncios } from "../config/multer.js";

import Anuncio from "../models/AnuncioModel.js";
import User from "../models/UserModel.js";
import * as ROUTES from "../config/routes.js";
import { convertirPrimeraLetraMayuscula } from "../helpers/date.js";


const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const Op = Sequelize.Op;    

const upload = multer({
    storage: storageAnuncios,
    limits: {
        fileSize: 1024 * 1024, // 1 MB
        fieldSize: 1024 * 1024,
        files: 1 // Máximo 5 archivos
    }
}).single('portada');

export const subirImagen = (req, res, next) => {
  upload(req, res, (err) => {
      const body = req.body;
      if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          if(err.code === "LIMIT_FILE_SIZE"){
              req.flash('error', 'El tamaño de la imagen debe ser como máximo de 1mb');
          }else{
              req.flash('error', err.message);
          }
          req.flash('fields', body);
          //SI existe el id, redirrecionamos a la pagina de camibo de imagen del anuncio
          if(req.params.id){
              return res.redirect(ROUTES.EDITAR_IMAGEN_ANUNCIO.replace(':id', req.params.id));
          }else{
              return res.redirect(ROUTES.AGREGAR_ANUNCIO);
          }        
      } else if (err) {
          // An unknown error occurred when uploading.
          req.flash('error', err.message);
          req.flash('fields', body);
          if(req.params.id){
              return res.redirect(ROUTES.EDITAR_IMAGEN_ANUNCIO.replace(':id', req.params.id));
          }else{
              return res.redirect(ROUTES.AGREGAR_ANUNCIO);
          }             
      }
      next();
  })
}

export const mostrarAnuncio = async (req, res) => {
  // const url = req.params.anuncio;
  // let anuncios = await obtenerAnuncios();
  // let anuncio = anuncios.find((anuncio) => anuncio.Url === url );
  // let anterior;
  // let despues;
  // let ubicacion
  // anuncios.forEach((anu, i) => {
  //   if(anu.Titulo === anuncio.Titulo){
  //     ubicacion = i;
  //   }
  // });
  // anterior = anuncios[ubicacion + 1];
  // despues = anuncios[ubicacion - 1];

  return res.render('anuncio/mostrar-anuncio', {
    // title: `${anuncio.Titulo} &#8211; OLADEG`,
    title: `I Primer Encuentro de Sostenibilidad en las Empresas Comunales &#8211; OLADEG`,
    // description: anuncio.metadescripcion,
    description: "",
    publicidad: ''
  })
}

export const mostrarPaginaAgregarAnuncio = async(req, res) => {
  const user = await User.findByPk(1);
  try{
    return res.render('anuncio/agregar-anuncio', {
      nombrePagina: "Agregar Anuncio",
      user,
      req
    })
  }catch(err){
    req.flash("error", err.message);
    return res.redirect(ROUTES.ANUNCIOS_ADMIN)
  }
}

export const agregarAnuncio = async(req, res) => {
  const body = req.body;
  body.userId = 1;

  //Verificar que el usuario sube un archivo
  if(!req.file){
      req.flash('error', 'La imagen del anuncio es obligatorio');
      req.flash('fields', body);        
      return res.redirect(ROUTES.AGREGAR_ANUNCIO);
  }
  body.portada = `/dist/uploads/anuncios/${req.file.filename}`

  try{
      let errorsExpress = validationResult(req);
      //Comprobamos si hay errores de express
      if(!errorsExpress.isEmpty()){
          //Si hay algun error, pues obviamente borramos el archivo subido
          const filePathImage = path.join(__dirname, `../public/${body.portada}`);
          if(req.file && fse.existsSync(filePathImage)){
              fse.unlinkSync(filePathImage);
          }

          const erroresExpress = errorsExpress.array().map(err => err.msg)
          req.flash('error', erroresExpress);
          req.flash('fields', body);        
          return res.redirect(ROUTES.AGREGAR_ANUNCIO);
      }
      await Anuncio.create(body);
      req.flash('success', 'Anuncio creado correctamente');
      return res.redirect(ROUTES.ANUNCIOS_ADMIN);
  }catch(err){
      let erroresSequelize = []
      //Vamos a obtener los errores del propio modelo si no cumple las restricciones que le pusimos para cada campo
      if(err.errors){
          erroresSequelize = err.errors.map(err => err.message);
      }else{
          erroresSequelize.push(err.message);
      }
      //Si hay algun error, pues obviamente borramos el archivo subido
      const filePathImage = path.join(__dirname, `../public/${body.portada}`);
      if(req.file && fse.existsSync(filePathImage)){
          fse.unlinkSync(filePathImage);
      }
      req.flash('error', erroresSequelize);
      req.flash('fields', body)
      return res.redirect(ROUTES.AGREGAR_ANUNCIO);
  }
}

export const mostrarPaginaEditarAnuncio = async(req, res) => {

}

export const editarAnuncio = async(req, res) => {

}

export const eliminarAnuncio = async(req, res) => {

}


