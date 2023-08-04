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
        //Tamaño total de los tres archivos
        fieldSize: 3 * 1024 * 1024,
        files: 3 // Máximo 3 archivos
    }
}).fields([
    {name: 'portada', maxCount: 1},
    {name: 'expositorImagen', maxCount: 1},
    {name: 'certificado', maxCount: 1}
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
  if(req.files.certificado){
    body.certificado = `/dist/uploads/programas/certificado/${req.files.certificado[0].filename}`
  }
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
          const filePathCertificado = path.join(__dirname, `../public/${body.certificado}`);
          if(fse.existsSync(filePathCertificado)){
              fse.unlinkSync(filePathCertificado);
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
      const filePathCertificado = path.join(__dirname, `../public/${body.certificado}`);
      if(fse.existsSync(filePathCertificado)){
          fse.unlinkSync(filePathCertificado);
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
        let programa;
        if(user.isAdmin){
            programa = await ProgramaAcademico.findOne({where: {id: req.params.id}});
        }else{
            programa = await ProgramaAcademico.findOne({where: {id: req.params.id, userId: user.id}});
        }
        if(!programa){
            req.flash('error', 'Acceso denegado');
            return res.redirect(ROUTES.PROGRAMAS_ADMIN);
        }
        return res.render('programa/editar-programa', {
            nombrePagina: "Editar Programa",
            user,
            req,
            programa,
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
        let programa;
        if(user.isAdmin){
            programa = await ProgramaAcademico.findOne({where: {id: req.params.id}});
        }else{
            programa = await ProgramaAcademico.findOne({where: {id: req.params.id, userId: user.id}});
        }

        //Editar un programa que no le pertenece al usuario
        if(!programa){
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
        
        let newProgram = body;
        //Solo el admin puede cambiar el autor de las entradas
        if(req.user.isAdmin){
            newProgram.userId = body.userId;
        }
        await ProgramaAcademico.update(newProgram, {
            where: {
                id: req.params.id
            },
            individualHooks: true,
        })
        
        req.flash('success', 'Programa académico editado correctamente');
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
        let programa;
        if(user.isAdmin){
            programa = await ProgramaAcademico.findOne({where: {id: req.params.id}});
        }else{
            programa = await ProgramaAcademico.findOne({where: {id: req.params.id, userId: user.id}});
        }

        if(!programa){
            req.flash('error', 'Acceso denegado');
            return res.redirect(ROUTES.PROGRAMAS_ADMIN);
        }
        return res.render('programa/editar-imagen-programa', {
            nombrePagina: `Editar Imagen Programa: ${programa.titulo}`,
            programa,
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
    if(req.files.portada){
        body.portada = `/dist/uploads/programas/portada/${req.files.portada[0].filename}`
    }
    if(req.files.expositorImagen){
        body.expositorImagen = `/dist/uploads/programas/expositor/${req.files.expositorImagen[0].filename}`
    }
    if(req.files.certificado){
        body.certificado = `/dist/uploads/programas/certificado/${req.files.certificado[0].filename}`
    }
    
    try{
        let programa;
        if(user.isAdmin){
            programa = await ProgramaAcademico.findOne({where: {id: req.params.id}});
        }else{
            programa = await ProgramaAcademico.findOne({where: {id: req.params.id, userId: user.id}});
        }

        if(!programa){
            req.flash('error', 'Acceso denegado');
            return res.redirect(ROUTES.PROGRAMAS_ADMIN);
        }
       
        let previousPortada = programa.portada;
        let previousExpositorImagen = programa.expositorImagen;
        let previousCertificado = programa.certificado;

        //Si hemos subido alguna imagen, lo cambiamos, Aqui si es que no subimos ninguna imagen, el body será vacio "{}", entonces no nos cambiara nada, para que nos cambie tiene que estar presente al menos el nombre del campo aunque su valor este vacio, ahi si nos cambia
        await ProgramaAcademico.update(body, {
            where: {
                id: req.params.id
            },
            individualHooks: true,
        })

        //Si existe una imagen previa lo borramos las imagenes del servidor siempre y cuando hayamos subido su reemplazo, lo ponemos aqui para asegurarno que guardo la nueva imagen en el servidor y su ruta en base de datos
        const filePathPreviousPortada = path.join(__dirname, `../public/${previousPortada}`);
        const filePathPreviousExpositorImagen = path.join(__dirname, `../public/${previousExpositorImagen}`);
        const filePathPreviousCertificado = path.join(__dirname, `../public/${previousCertificado}`);

        if(fse.existsSync(filePathPreviousPortada && body.portada)){
            fse.unlinkSync(filePathPreviousPortada);
        }
        if(fse.existsSync(filePathPreviousExpositorImagen && body.expositorImagen)){
            fse.unlinkSync(filePathPreviousExpositorImagen);
        }
        if(fse.existsSync(filePathPreviousCertificado && body.certificado)){
            fse.unlinkSync(filePathPreviousCertificado);
        }

        req.flash('success', 'Imagenes cambiadas correctamente');
        return res.redirect(ROUTES.PROGRAMAS_ADMIN);
    }catch(err){
        //Si algo ocurrio, borramos las imagenes que se subio
        const filePathPortada = path.join(__dirname, `../public/${body.portada}`);
        const filePathExpositorImagen = path.join(__dirname, `../public/${body.expositorImagen}`);
        const filePathCertificado = path.join(__dirname, `../public/${body.certificado}`);

        if(fse.existsSync(filePathPortada)){
            fse.unlinkSync(filePathPortada);
        }
        if(fse.existsSync(filePathExpositorImagen)){
            fse.unlinkSync(filePathExpositorImagen);
        }
        if(fse.existsSync(filePathCertificado)){
            fse.unlinkSync(filePathCertificado);
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
        let programaAcademico;
        if(user.isAdmin){
            programaAcademico = await ProgramaAcademico.findOne({where: {id: req.params.id}});
        }else{
            programaAcademico = await ProgramaAcademico.findOne({where: {id: req.params.id, userId: user.id}});
        }

        if(!programaAcademico){
            return res.status(401).json({message: "Acceso denegado"});
        }
        console.log({
            programaAcademico
        })
        const filePathPreviousPortada = path.join(__dirname, `../public/${programaAcademico.portada}`);
        const filePathPreviousExpositorImagen = path.join(__dirname, `../public/${programaAcademico.expositorImagen}`);
        const filePathPreviousCertificado = path.join(__dirname, `../public/${programaAcademico.certificado}`);

        if(fse.existsSync(filePathPreviousPortada)){
            fse.unlinkSync(filePathPreviousPortada);
        }
        if(fse.existsSync(filePathPreviousExpositorImagen)){
            fse.unlinkSync(filePathPreviousExpositorImagen);
        }
        if(fse.existsSync(filePathPreviousCertificado)){
            fse.unlinkSync(filePathPreviousCertificado);
        }

        await ProgramaAcademico.destroy({where: {id: req.params.id}});
        return res.status(200).json({message: "El programa académico ha sido eliminado."});
    }catch(err){
        const status = err.status ? err.status : res.statusCode === 200 ? 500 : res.statusCode;
        const message = err.message;
        return res.status(status).json({message});
    }
}

