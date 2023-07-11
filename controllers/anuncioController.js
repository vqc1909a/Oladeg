import * as url from 'url';
import Sequelize from "sequelize";
import path from "path";
import { validationResult } from "express-validator";
import multer from "multer";
import fse from "fs-extra";
import { storageAnuncios } from "../config/multer.js";

import Anuncio from "../models/AnuncioModel.js";
import User from "../models/UserModel.js";
import * as ROUTES from "../config/routes.js";
import {DateTime} from "luxon";
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

  try{
    const slug = req.params.slug
    const [anuncios, anuncio] = await Promise.all([Anuncio.findAll({
        order: [["fechaYHora", "ASC"]]
    }), Anuncio.findOne({where: {slug}, order: [["fechaYHora", "ASC"]]})])
    if(!anuncio){
        req.flash("error", "El anuncio no existe");
        return res.redirect(ROUTES.HOME)
    }
    const index = anuncios.findIndex(a => a.id === anuncio.id);
    const indexAnterior = index === 0 ? 0 : index - 1;
    const indexSiguiente = (index === anuncios.length - 1) ? index : index + 1;

    const isButtonAnterior = index > 0;
    const isButtonSiguiente = index < anuncios.length - 1

    let anuncioAnterior = isButtonAnterior ? anuncios.slice(indexAnterior, indexAnterior  + 1)[0] : undefined;
    let anuncioSiguiente = isButtonSiguiente ? anuncios.slice(indexSiguiente, indexSiguiente  + 1)[0] : undefined;
    
    return res.render('anuncio/mostrar-anuncio', {
        title: `${anuncio.titulo} &#8211; OLADEG`,
        description: anuncio.extracto,
        publicidad: '',
        anuncio,
        isButtonAnterior,
        isButtonSiguiente,
        anuncioAnterior,
        anuncioSiguiente,
        DateTime,
        convertirPrimeraLetraMayuscula
    })
  }catch(err){
    req.flash("error", err.message);
    return res.redirect(ROUTES.HOME);
  }
}

export const mostrarPaginaAgregarAnuncio = async(req, res) => {
  const user = req.user;
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
  body.userId = req.user.id;
  if(req.file){
    body.portada = `/dist/uploads/anuncios/${req.file.filename}`
  }
  try{
      let errorsExpress = validationResult(req);
      //Comprobamos si hay errores de express
      if(!errorsExpress.isEmpty()){
          //Si hay algun error, pues obviamente borramos el archivo subido
          const filePathImage = path.join(__dirname, `../public/${body.portada}`);
          if(fse.existsSync(filePathImage)){
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
      if(fse.existsSync(filePathImage)){
          fse.unlinkSync(filePathImage);
      }
      req.flash('error', erroresSequelize);
      req.flash('fields', body)
      return res.redirect(ROUTES.AGREGAR_ANUNCIO);
  }
}

export const mostrarPaginaEditarAnuncio = async(req, res) => {
    const user = req.user;
    const users = await User.findAll({});
    try{
        let anuncio;
        if(user.isAdmin){
            anuncio = await Anuncio.findOne({where: {id: req.params.id}});
        }else{
            anuncio = await Anuncio.findOne({where: {id: req.params.id, userId: user.id}});
        }
        if(!anuncio){
            req.flash('error', 'Acceso denegado');
            return res.redirect(ROUTES.ANUNCIOS_ADMIN);
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
        return res.redirect(ROUTES.ANUNCIOS_ADMIN)
    }
}

export const editarAnuncio = async(req, res) => {
    const body = req.body;
    const user = req.user;
    try{
        let anuncio;
        if(user.isAdmin){
            anuncio = await Anuncio.findOne({where: {id: req.params.id}});
        }else{
            anuncio = await Anuncio.findOne({where: {id: req.params.id, userId: user.id}});
        }

        //Editar un anuncio que no le pertenece al usuario
        if(!anuncio){
            req.flash('error', 'Operación no válida');
            return res.redirect(ROUTES.ANUNCIOS_ADMIN);
        }

        let errorsExpress = validationResult(req);
        //Comprobamos si hay errores de express
        if(!errorsExpress.isEmpty()){
            const erroresExpress = errorsExpress.array().map(err => err.msg)
            req.flash('error', erroresExpress);
            req.flash('fields', body);        
            return res.redirect(ROUTES.EDITAR_ANUNCIO.replace(':id', req.params.id));
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
        return res.redirect(ROUTES.ANUNCIOS_ADMIN);
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
        return res.redirect(ROUTES.EDITAR_ANUNCIO.replace(':id', req.params.id));
    }
}

export const mostrarPaginaEditarImagenAnuncio = async (req, res) => {
    // Group.findByPk(req.params.id);
    const user = req.user;

    try{
        let anuncio;
        if(user.isAdmin){
            anuncio = await Anuncio.findOne({where: {id: req.params.id}});
        }else{
            anuncio = await Anuncio.findOne({where: {id: req.params.id, userId: user.id}});
        }

        if(!anuncio){
            req.flash('error', 'Acceso denegado');
            return res.redirect(ROUTES.ANUNCIOS_ADMIN);
        }
        return res.render('anuncio/editar-imagen-anuncio', {
            nombrePagina: `Editar Imagen Anuncio: ${anuncio.titulo}`,
            anuncio,
            user,
            req
        })
    }catch(err){
        req.flash('error', err.message);
        return res.redirect(ROUTES.ANUNCIOS_ADMIN);
    }
}

export const editarImagenAnuncio = async (req, res) => {
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
            anuncio = await Anuncio.findOne({where: {id: req.params.id}});
        }else{
            anuncio = await Anuncio.findOne({where: {id: req.params.id, userId: user.id}});
        }

        if(!anuncio){
            req.flash('error', 'Acceso denegado');
            return res.redirect(ROUTES.ANUNCIOS_ADMIN);
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
        return res.redirect(ROUTES.ANUNCIOS_ADMIN);
    }catch(err){
        //Si algo ocurrio, borramos la nueva imagen que se subio
        const filePathImage = path.join(__dirname, `../public/${body.portada}`);
        if(fse.existsSync(filePathImage)){
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
        return res.redirect(ROUTES.EDITAR_IMAGEN_ANUNCIO.replace(':id', req.params.id));
    }
}

export const eliminarAnuncio = async(req, res) => {
    const user = req.user;
    try{
        let anuncio;
        if(user.isAdmin){
            anuncio = await Anuncio.findOne({where: {id: req.params.id}});
        }else{
            anuncio = await Anuncio.findOne({where: {id: req.params.id, userId: user.id}});
        }
        if(!anuncio){
            return res.status(401).json({message: "Acceso denegado"});
        }
        const filePathImage = path.join(__dirname, `../public/${anuncio.portada}`);
        if(anuncio.portada && fse.existsSync(filePathImage)){
            fse.unlinkSync(filePathImage);
        }

        await Anuncio.destroy({where: {id: req.params.id}});
        return res.status(200).json({message: "El anuncio ha sido eliminado."});
    }catch(err){
        const message = err.message;
        return res.status(400).json({message});
    }
}


