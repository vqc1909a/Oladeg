import * as url from 'url';
import Sequelize from "sequelize";
import path from "path";
import { validationResult } from "express-validator";
import multer from "multer";
import fse from "fs-extra";
import { storageProgramasAcademicos } from "../config/multer.js";

import ProgramaAcademico from "../models/ProgramaAcademicoModel.js";

import User from "../models/UserModel.js";
import * as ROUTES from "../config/routes.js";
import {DateTime} from "luxon";
import { convertirPrimeraLetraMayuscula } from "../helpers/date.js";


const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const Op = Sequelize.Op;    

const upload = multer({
    storage: storageProgramasAcademicos,
    limits: {
        fileSize: 1024 * 1024, // 1 MB
        fieldSize: 1024 * 1024,
        files: 2 // Máximo 5 archivos
    }
}).fields([
    {name: 'portada', maxCount: 1},
    {name: 'expositorImagen', maxCount: 1}
]);

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
              return res.redirect(ROUTES.EDITAR_IMAGEN_PROGRAMA.replace(':id', req.params.id));
          }else{
              return res.redirect(ROUTES.AGREGAR_PROGRAMA);
          }        
      } else if (err) {
          // An unknown error occurred when uploading.
          req.flash('error', err.message);
          req.flash('fields', body);
          if(req.params.id){
              return res.redirect(ROUTES.EDITAR_IMAGEN_PROGRAMA.replace(':id', req.params.id));
          }else{
              return res.redirect(ROUTES.AGREGAR_PROGRAMA);
          }             
      }
      next();
  })
}

export const mostrarPaginaAgregarPrograma = async(req, res) => {
  const user = req.user;
  try{
    return res.render('programa/agregar-programa', {
      nombrePagina: "Agregar Programa Académico",
      user,
      req
    })
  }catch(err){
    req.flash("error", err.message);
    return res.redirect(ROUTES.PROGRAMAS_ADMIN)
  }
}

export const agregarPrograma = async(req, res) => {
  const body = req.body;
  body.userId = req.user.id;
  if(req.files.portada){
    body.portada = `/dist/uploads/programas/portada/${req.files.portada[0].filename}`
  }
  if(req.files.expositorImagen){
    body.expositorImagen = `/dist/uploads/programas/expositor/${req.files.expositorImagen[0].filename}`
  }

  console.log({
    body
  })
  try{
      let errorsExpress = validationResult(req);
      //Comprobamos si hay errores de express
      if(!errorsExpress.isEmpty()){
          //Si hay algun error, pues obviamente borramos los archivos subido
          const filePathPortada = path.join(__dirname, `../public/${body.portada}`);
          if(fse.existsSync(filePathPortada)){
              fse.unlinkSync(filePathPortada);
          }
          const filePathExpositor = path.join(__dirname, `../public/${body.expositorImagen}`);
          if(fse.existsSync(filePathExpositor)){
              fse.unlinkSync(filePathExpositor);
          }

          const erroresExpress = errorsExpress.array().map(err => err.msg)
          req.flash('error', erroresExpress);
          req.flash('fields', body);        
          return res.redirect(ROUTES.AGREGAR_PROGRAMA);
      }
      await ProgramaAcademico.create(body);
      req.flash('success', 'Programa creado correctamente');
      return res.redirect(ROUTES.PROGRAMAS_ADMIN);
  }catch(err){
      let erroresSequelize = []
      //Vamos a obtener los errores del propio modelo si no cumple las restricciones que le pusimos para cada campo
      if(err.errors){
        erroresSequelize = err.errors.map(err => err.message);
      }else{
          erroresSequelize.push(err.message);
      }
      //Si hay algun error, pues obviamente borramos los archivos subido
      const filePathPortada = path.join(__dirname, `../public/${body.portada}`);
      if(fse.existsSync(filePathPortada)){
          fse.unlinkSync(filePathPortada);
      }
      const filePathExpositor = path.join(__dirname, `../public/${body.expositorImagen}`);
      if(fse.existsSync(filePathExpositor)){
          fse.unlinkSync(filePathExpositor);
      }
      req.flash('error', erroresSequelize);
      req.flash('fields', body)
      return res.redirect(ROUTES.AGREGAR_PROGRAMA);
  }
}

export const mostrarPaginaEditarPrograma = async(req, res) => {
    const user = req.user;
    const users = await User.findAll({});
    try{
        let anuncio;
        if(user.isAdmin){
            anuncio = await ProgramaAcademico.findOne({where: {id: req.params.id}});
        }else{
            anuncio = await ProgramaAcademico.findOne({where: {id: req.params.id, userId: user.id}});
        }
        if(!anuncio){
            req.flash('error', 'Acceso denegado');
            return res.redirect(ROUTES.PROGRAMAS_ADMIN);
        }
        return res.render('anuncio/editar-anuncio', {
            nombrePagina: "Editar Anuncio",
            user,
            req,
            anuncio,
            users
        })
    }catch(err){
        req.flash("error", err.message);
        return res.redirect(ROUTES.PROGRAMAS_ADMIN)
    }
}

export const editarPrograma = async(req, res) => {
    const body = req.body;
    const user = req.user;
    try{
        let anuncio;
        if(user.isAdmin){
            anuncio = await ProgramaAcademico.findOne({where: {id: req.params.id}});
        }else{
            anuncio = await ProgramaAcademico.findOne({where: {id: req.params.id, userId: user.id}});
        }

        //Editar un anuncio que no le pertenece al usuario
        if(!anuncio){
            req.flash('error', 'Operación no válida');
            return res.redirect(ROUTES.PROGRAMAS_ADMIN);
        }

        let errorsExpress = validationResult(req);
        //Comprobamos si hay errores de express
        if(!errorsExpress.isEmpty()){
            const erroresExpress = errorsExpress.array().map(err => err.msg)
            req.flash('error', erroresExpress);
            req.flash('fields', body);        
            return res.redirect(ROUTES.EDITAR_PROGRAMA.replace(':id', req.params.id));
        }
        anuncio.titulo = body.titulo;
        anuncio.extracto = body.extracto;
        anuncio.fecha = body.fecha;
        anuncio.hora = body.hora;
        anuncio.contenido = body.contenido;
        //SOlo el admin puede cambiar el autor de las entradas
        if(req.user.isAdmin){
            anuncio.userId = body.userId;
        }
        
        await anuncio.save();
        req.flash('success', 'Anuncio editado correctamente');
        return res.redirect(ROUTES.PROGRAMAS_ADMIN);
    }catch(err){
        let erroresSequelize = []
        //Vamos a obtener los errores del propio modelo si no cumple las restricciones que le pusimos para cada campo
        if(err.errors){
            erroresSequelize = err.errors.map(err => err.message);
        }else{
            erroresSequelize.push(err.message);
        }
        req.flash('error', erroresSequelize);
        req.flash('fields', body)
        return res.redirect(ROUTES.EDITAR_PROGRAMA.replace(':id', req.params.id));
    }
}

export const mostrarPaginaEditarImagenPrograma = async (req, res) => {
    // Group.findByPk(req.params.id);
    const user = req.user;

    try{
        let anuncio;
        if(user.isAdmin){
            anuncio = await ProgramaAcademico.findOne({where: {id: req.params.id}});
        }else{
            anuncio = await ProgramaAcademico.findOne({where: {id: req.params.id, userId: user.id}});
        }

        if(!anuncio){
            req.flash('error', 'Acceso denegado');
            return res.redirect(ROUTES.PROGRAMAS_ADMIN);
        }
        return res.render('anuncio/editar-imagen-anuncio', {
            nombrePagina: `Editar Imagen Anuncio: ${anuncio.titulo}`,
            anuncio,
            user,
            req
        })
    }catch(err){
        req.flash('error', err.message);
        return res.redirect(ROUTES.PROGRAMAS_ADMIN);
    }
}

export const editarImagenPrograma = async (req, res) => {
    // Group.findByPk(req.params.id);
    const body = req.body; 
    const user = req.user;
    //Verificar que el usuario sube una imagen
    if(req.file){
        body.portada = `/dist/uploads/anuncios/${req.file.filename}`
    }
    try{
        let anuncio;
        if(user.isAdmin){
            anuncio = await ProgramaAcademico.findOne({where: {id: req.params.id}});
        }else{
            anuncio = await ProgramaAcademico.findOne({where: {id: req.params.id, userId: user.id}});
        }

        if(!anuncio){
            req.flash('error', 'Acceso denegado');
            return res.redirect(ROUTES.PROGRAMAS_ADMIN);
        }
       
        let previousImage = anuncio.portada;
        //Si hemos subido la imagen, lo cambiamos 
        anuncio.portada = body.portada
        await anuncio.save();

        //Si existe una imagen previa, borramos la imagen del servidor, lo ponemos aqui para asegurarno que guardo la nueva imagen en el servidor y su ruta en base de datos
        const filePathPreviousImage = path.join(__dirname, `../public/${previousImage}`);
        if(previousImage && fse.existsSync(filePathPreviousImage)){
            fse.unlinkSync(filePathPreviousImage);
        }
        req.flash('success', 'Portada cambiado correctamente');
        return res.redirect(ROUTES.PROGRAMAS_ADMIN);
    }catch(err){
        //Si algo ocurrio, borramos la nueva imagen que se subio
        const filePathImage = path.join(__dirname, `../public/${body.portada}`);
        if(req.file && fse.existsSync(filePathImage)){
            fse.unlinkSync(filePathImage);
        }
        
        let erroresSequelize = []
        //Vamos a obtener los errores del propio modelo si no cumple las restricciones que le pusimos para cada campo
        if(err.errors){
            erroresSequelize = err.errors.map(err => err.message);
        }else{
            erroresSequelize.push(err.message);
        }
        req.flash('error', erroresSequelize);
        return res.redirect(ROUTES.EDITAR_IMAGEN_PROGRAMA.replace(':id', req.params.id));
    }
}

export const eliminarPrograma = async(req, res) => {
    const user = req.user;
    try{
        let anuncio;
        if(user.isAdmin){
            anuncio = await ProgramaAcademico.findOne({where: {id: req.params.id}});
        }else{
            anuncio = await ProgramaAcademico.findOne({where: {id: req.params.id, userId: user.id}});
        }
        if(!anuncio){
            return res.status(401).json({message: "Acceso denegado"});
        }
        const filePathImage = path.join(__dirname, `../public/${anuncio.portada}`);
        if(anuncio.portada && fse.existsSync(filePathImage)){
            fse.unlinkSync(filePathImage);
        }

        await ProgramaAcademico.destroy({where: {id: req.params.id}});
        return res.status(200).json({message: "El anuncio ha sido eliminado."});
    }catch(err){
        const message = err.message;
        return res.status(400).json({message});
    }
}

