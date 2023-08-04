import * as url from 'url';
import Sequelize from "sequelize";
import path from "path";
import { validationResult } from "express-validator";
import multer from "multer";
import fse from "fs-extra";
import { storageBoletines } from "../config/multer.js";

import Boletin from "../models/BoletinModel.js";
import User from "../models/UserModel.js";
import * as ROUTES from "../config/routes.js";
import {DateTime} from "luxon";
import { convertirPrimeraLetraMayuscula } from "../helpers/date.js";


const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const Op = Sequelize.Op;    

const upload = multer({
    storage: storageBoletines,
    limits: {
        fileSize: 1024 * 1024, // 1 MB
        //Tamaño total de los dos archivos
        fieldSize: 2 * 1024 * 1024,
        files: 2 // Máximo 5 archivos
    }
}).fields([
  {name: 'portada', maxCount: 1},
  {name: 'archivo', maxCount: 1},
]);

export const subirImagen = (req, res, next) => {
  
  upload(req, res, (err) => {
      const body = req.body;
      if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          if(err.code === "LIMIT_FILE_SIZE"){
              req.flash('error', 'El tamaño de la imagen o archivo debe ser como máximo de 1mb');
          }else{
              req.flash('error', err.message);
          }
          req.flash('fields', body);
          //SI existe el id, redirrecionamos a la pagina de camibo de imagen del boletin
          if(req.params.id){
              return res.redirect(ROUTES.EDITAR_IMAGEN_BOLETIN.replace(':id', req.params.id));
          }else{ 
              return res.redirect(ROUTES.AGREGAR_BOLETIN);
          }        
      } else if (err) {
          // An unknown error occurred when uploading.
          req.flash('error', err.message);
          req.flash('fields', body);
          if(req.params.id){
              return res.redirect(ROUTES.EDITAR_IMAGEN_BOLETIN.replace(':id', req.params.id));
          }else{
              return res.redirect(ROUTES.AGREGAR_BOLETIN);
          }             
      }
      next();
  })
}

export const mostrarBoletines = async (req, res) => {
  let boletines = await obtenerBoletines();
  let pagina_actual = req.query.page ? parseInt(req.query.page) : 1;
  let total_elementos = boletines.length;
  let elementos_por_pagina = 4;
  let elementos_hasta_ahora = elementos_por_pagina;
  let total_paginas = Math.ceil(total_elementos / elementos_por_pagina)
  if(!isNaN(pagina_actual) & pagina_actual >= 1 & pagina_actual <= total_paginas){
    elementos_hasta_ahora = pagina_actual * elementos_por_pagina;
  }else{
    pagina_actual = 1;
  }
  boletines = boletines.slice(elementos_hasta_ahora - elementos_por_pagina, elementos_hasta_ahora);
  return res.render("pages/boletinesView", {
    title: "Biblioteca Digital &#8211; OLADEG",
    description: "Ofrecemos documentos, boletines y artículos digitales relacionados a temas de Gestión Pública y Empresarial, Planificación, Monitoreo y Evaluación de Proyectos de Desarrollo Económico Rural.",
    protocol: req.protocol,
    host: req.headers.host,
    boletines,
    pagina_actual,
    total_elementos,
    elementos_por_pagina,
    total_paginas,
    publicidad: ''
  });
}

export const mostrarBoletin = async (req, res) => {
  const url = req.params.boletin;
  let boletines = await obtenerBoletines();
  let boletin = boletines.find((lib) => lib.Url === url );
  let anterior;
  let despues;
  let ubicacion
  boletines.forEach((lib, i) => {
    if(lib.Titulo === boletin.Titulo){
      ubicacion = i;
    }
  });
  anterior = boletines[ubicacion + 1];
  despues = boletines[ubicacion - 1];
  return res.render('pages/boletinView', {
    title: `${boletin.Titulo} &#8211; OLADEG`,
    description: boletin.metadescripcion,
    protocol: req.protocol, 
    host: req.headers.host,
    boletin,
    anterior,
    despues,
    publicidad: ''
  })
 
}

export const mostrarPaginaAgregarBoletin = async(req, res) => {
  const user = req.user;
  try{
    return res.render('boletin/agregar-boletin', {
      nombrePagina: "Agregar Boletin",
      user,
      req
    })
  }catch(err){
    req.flash("error", err.message);
    return res.redirect(ROUTES.BOLETINES_ADMIN)
  }
}

export const agregarBoletin = async(req, res) => {
  const body = req.body;
  body.userId = req.user.id;
  if(req.files.portada){
    body.portada = `/dist/uploads/boletines/portada/${req.files.portada[0].filename}`
  }
  if(req.files.archivo){
    body.archivo = `/dist/uploads/boletines/archivo/${req.files.archivo[0].filename}`
  }
  try{
      let errorsExpress = validationResult(req);
      //Comprobamos si hay errores de express
      if(!errorsExpress.isEmpty()){
          //Si hay algun error, pues obviamente borramos el archivo subido
          const filePathPortada = path.join(__dirname, `../public/${body.portada}`);
          if(fse.existsSync(filePathPortada)){
              fse.unlinkSync(filePathPortada);
          }
          const filePathArchivo = path.join(__dirname, `../public/${body.archivo}`);
          if(fse.existsSync(filePathArchivo)){
              fse.unlinkSync(filePathArchivo);
          }

          const erroresExpress = errorsExpress.array().map(err => err.msg)
          req.flash('error', erroresExpress);
          req.flash('fields', body);        
          return res.redirect(ROUTES.AGREGAR_BOLETIN);
      }
      //Create a difenrecia del Update es que create si o si necesita los campos y debe validar dichos campos, en cambio cuando usas update, sequelize interpreta que si le pasas un objeto vacio, entonces no quieres actualizar nada, pero si le pasas un objeto con algunos campos, pues te validara dichos campos según lo que pusiste en tu model
      await Boletin.create(body);
      req.flash('success', 'Boletin creado correctamente');
      return res.redirect(ROUTES.BOLETINES_ADMIN);
  }catch(err){
      let erroresSequelize = []
      //Vamos a obtener los errores del propio modelo si no cumple las restricciones que le pusimos para cada campo
      if(err.errors){
        erroresSequelize = err.errors.map(err => err.message);
      }else{
          erroresSequelize.push(err.message);
      }
      //Si hay algun error, pues obviamente borramos el archivo subido
      const filePathPortada = path.join(__dirname, `../public/${body.portada}`);
      if(fse.existsSync(filePathPortada)){
          fse.unlinkSync(filePathPortada);
      }
      const filePathArchivo = path.join(__dirname, `../public/${body.archivo}`);
      if(fse.existsSync(filePathArchivo)){
          fse.unlinkSync(filePathArchivo);
      }
      
      req.flash('error', erroresSequelize);
      req.flash('fields', body)
      return res.redirect(ROUTES.AGREGAR_BOLETIN);
  }
}

export const mostrarPaginaEditarBoletin = async(req, res) => {
    const user = req.user;
    const users = await User.findAll({});
    try{
        let boletin;
        if(user.isAdmin){
            boletin = await Boletin.findOne({where: {id: req.params.id}});
        }else{
            boletin = await Boletin.findOne({where: {id: req.params.id, userId: user.id}});
        }
        if(!boletin){
            req.flash('error', 'Acceso denegado');
            return res.redirect(ROUTES.BOLETINES_ADMIN);
        }
        return res.render('boletin/editar-boletin', {
            nombrePagina: "Editar Boletin",
            user,
            req,
            boletin,
            users
        })
    }catch(err){
        req.flash("error", err.message);
        return res.redirect(ROUTES.BOLETINES_ADMIN)
    }
}

export const editarBoletin = async(req, res) => {
    const body = req.body;
    const user = req.user;
    try{
        let boletin;
        if(user.isAdmin){
            boletin = await Boletin.findOne({where: {id: req.params.id}});
        }else{
            boletin = await Boletin.findOne({where: {id: req.params.id, userId: user.id}});
        }

        //Editar un boletin que no le pertenece al usuario
        if(!boletin){
            req.flash('error', 'Operación no válida');
            return res.redirect(ROUTES.BOLETINES_ADMIN);
        }

        let errorsExpress = validationResult(req);
        //Comprobamos si hay errores de express
        if(!errorsExpress.isEmpty()){
            const erroresExpress = errorsExpress.array().map(err => err.msg)
            req.flash('error', erroresExpress);
            req.flash('fields', body);        
            return res.redirect(ROUTES.EDITAR_BOLETIN.replace(':id', req.params.id));
        }
        boletin.titulo = body.titulo;
        boletin.autor = body.autor;
        boletin.fechaPublicacion = body.fechaPublicacion;
        boletin.contenido = body.contenido;
        //SOlo el admin puede cambiar el usuario de las entradas
        if(req.user.isAdmin){
            boletin.userId = body.userId;
        }
        
        await boletin.save();
        req.flash('success', 'Boletin editado correctamente');
        return res.redirect(ROUTES.BOLETINES_ADMIN);
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
        return res.redirect(ROUTES.EDITAR_BOLETIN.replace(':id', req.params.id));
    }
}

export const mostrarPaginaEditarImagenBoletin = async (req, res) => {
    // Group.findByPk(req.params.id);
    const user = req.user;

    try{
        let boletin;
        if(user.isAdmin){
            boletin = await Boletin.findOne({where: {id: req.params.id}});
        }else{
            boletin = await Boletin.findOne({where: {id: req.params.id, userId: user.id}});
        }

        if(!boletin){
            req.flash('error', 'Acceso denegado');
            return res.redirect(ROUTES.BOLETINES_ADMIN);
        }
        return res.render('boletin/editar-imagen-boletin', {
            nombrePagina: `Editar Imagen-Archivo del Boletin: ${boletin.titulo}`,
            boletin,
            user,
            req
        })
    }catch(err){
        req.flash('error', err.message);
        return res.redirect(ROUTES.BOLETINES_ADMIN);
    }
}

export const editarImagenBoletin = async (req, res) => {
    // Group.findByPk(req.params.id);
    const body = req.body; 
    const user = req.user;
    //Verificar que el usuario sube una imagen
    if(req.files.portada){
        body.portada = `/dist/uploads/boletines/portada/${req.files.portada[0].filename}`
    }
     if(req.files.archivo){
        body.archivo = `/dist/uploads/boletines/archivo/${req.files.archivo[0].filename}`
    }
    try{
        let boletin;
        if(user.isAdmin){
            boletin = await Boletin.findOne({where: {id: req.params.id}});
        }else{
            boletin = await Boletin.findOne({where: {id: req.params.id, userId: user.id}});
        }

        if(!boletin){
            req.flash('error', 'Acceso denegado');
            return res.redirect(ROUTES.BOLETINES_ADMIN);
        }
       
        let previousPortada = boletin.portada;
        let previousArchivo = boletin.archivo;

        //Si hemos subido la imagen, lo cambiamos 
        await Boletin.update(body, {
            where: {
                id: req.params.id
            },
            individualHooks: true
        })

        //Si existe una imagen previa, borramos la imagen del servidor, lo ponemos aqui para asegurarno que guardo la nueva imagen en el servidor y su ruta en base de datos
        const filePathPreviousPortada = path.join(__dirname, `../public/${previousPortada}`);
        const filePathPreviousArchivo = path.join(__dirname, `../public/${previousArchivo}`);

        if(fse.existsSync(filePathPreviousPortada) && body.portada){
            fse.unlinkSync(filePathPreviousPortada);
        }
         if(fse.existsSync(filePathPreviousArchivo) && body.archivo){
            fse.unlinkSync(filePathPreviousArchivo);
        }
        req.flash('success', 'Imagen/Archivo cambiado correctamente');
        return res.redirect(ROUTES.BOLETINES_ADMIN);
    }catch(err){
        
        //Si algo ocurrio, borramos la nueva imagen que se subio
        const filePathPortada = path.join(__dirname, `../public/${body.portada}`);
        const filePathArchivo = path.join(__dirname, `../public/${body.archivo}`);

        if(fse.existsSync(filePathPortada)){
            fse.unlinkSync(filePathPortada);
        }

        if(fse.existsSync(filePathArchivo)){
            fse.unlinkSync(filePathArchivo);
        }

        let erroresSequelize = []
        //Vamos a obtener los errores del propio modelo si no cumple las restricciones que le pusimos para cada campo
        if(err.errors){
            erroresSequelize = err.errors.map(err => err.message);
        }else{
            erroresSequelize.push(err.message);
        }
        req.flash('error', erroresSequelize);
        return res.redirect(ROUTES.EDITAR_IMAGEN_BOLETIN.replace(':id', req.params.id));
    }
}

export const eliminarBoletin = async(req, res) => {
    const user = req.user;
    try{
        let boletin;
        if(user.isAdmin){
            boletin = await Boletin.findOne({where: {id: req.params.id}});
        }else{
            boletin = await Boletin.findOne({where: {id: req.params.id, userId: user.id}});
        }
        if(!boletin){
            return res.status(401).json({message: "Acceso denegado"});
        }
        const filePathPortada = path.join(__dirname, `../public/${boletin.portada}`);
        const filePathArchivo = path.join(__dirname, `../public/${boletin.archivo}`);

        if(fse.existsSync(filePathPortada)){
            fse.unlinkSync(filePathPortada);
        }
        if(fse.existsSync(filePathArchivo)){
            fse.unlinkSync(filePathArchivo);
        }
        await Boletin.destroy({where: {id: req.params.id}});
        return res.status(200).json({message: "El boletin ha sido eliminado."});
    }catch(err){
        const status = err.status ? err.status : res.statusCode === 200 ? 500 : res.statusCode;
        const message = err.message;
        return res.status(status).json({message});
    }
}

