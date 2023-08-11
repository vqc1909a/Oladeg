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
    try{
        const boletines = await Boletin.findAll({order: [["updatedAt", "DESC"]]});
        const cantidadBoletinesPagina = 4;
        const totalBoletines = boletines.length;
        const cantidadPaginas = Math.ceil(totalBoletines / cantidadBoletinesPagina)
        const paginaActual = Number(req.query.page ? (req.query.page >= 1 && req.query.page <= cantidadPaginas) ? req.query.page : 1 : 1)
    
        const isPaginacionesNormal = (cantidadPaginas <= 5) && (paginaActual <= 5) // 5 paginaciones del 1 al 5 o menos según la cantidad de paginas
        const isPaginacionesIzquierda = (cantidadPaginas > 5) && (paginaActual <= 3); // 5 paginaciones del 1 2 3 ... final
        const isPaginacionesMedia = (cantidadPaginas > 5) && (paginaActual > 3) && (paginaActual < cantidadPaginas - 2) // 5 paginaciones del 1 ... 4 ... final
        const isPaginacionesDerecha = (cantidadPaginas > 5) && (paginaActual >= cantidadPaginas - 2)
    
        const isPaginacionAnterior = paginaActual > 1;
        const isPaginacionSiguiente = paginaActual < cantidadPaginas;
        const arrayPaginas = [];
        for (var i = 1; i <= cantidadPaginas; i++) {
          arrayPaginas.push(i); // Agrega cada número al array
        }
    
        const boletinesFiltrados = boletines.slice(cantidadBoletinesPagina * (paginaActual - 1), cantidadBoletinesPagina * paginaActual);
    
        
        return res.render("boletin/mostrar-boletines", {
          title: "Boletines &#8211; OLADEG",
          description: "Ofrecemos documentos, boletines y artículos digitales relacionados a temas de Gestión Pública y Empresarial, Planificación, Monitoreo y Evaluación de Proyectos de Desarrollo Económico Rural.",
          publicidad: '',
          boletines: boletinesFiltrados,
          req,
          DateTime,
          convertirPrimeraLetraMayuscula,
          paginaActual,
          cantidadBoletinesPagina,
          cantidadPaginas,
          totalBoletines,
          arrayPaginas,
          isPaginacionesNormal,
          isPaginacionesIzquierda,
          isPaginacionesMedia,
          isPaginacionesDerecha,
          isPaginacionAnterior,
          isPaginacionSiguiente,
          ROUTES
        });
    }catch(err){
        req.flash("error", err.message);
        return res.redirect(ROUTES.MOSTRAR_BOLETINES);
    }
}

export const mostrarBoletin = async (req, res) => {
  try{ 
    const slug = req.params.slug
    const [boletines, boletin] = await Promise.all([
      Boletin.findAll({
        order: [["updatedAt", "DESC"]]
      }), 
      Boletin.findOne({
        where: {slug},
        order: [["updatedAt", "DESC"]]
      })
    ])
    if(!boletin){
        req.flash("error", "El boletin no existe");
        return res.redirect(ROUTES.HOME)
    }
    const index = boletines.findIndex(a => a.id === boletin.id);
    const indexAnterior = index === 0 ? 0 : index - 1;
    const indexSiguiente = (index === boletines.length - 1) ? index : index + 1;

    const isButtonAnterior = index > 0;
    const isButtonSiguiente = index < boletines.length - 1

    let contenidoAnterior = isButtonAnterior ? boletines.slice(indexAnterior, indexAnterior  + 1)[0] : undefined;
    let contenidoSiguiente = isButtonSiguiente ? boletines.slice(indexSiguiente, indexSiguiente  + 1)[0] : undefined;
    
    return res.render('boletin/mostrar-boletin', {
        title: `${boletin.titulo} &#8211; OLADEG`,
        description: '',
        publicidad: '',
        boletin,
        isButtonAnterior,
        isButtonSiguiente,
        contenidoAnterior,
        contenidoSiguiente,
        DateTime,
        convertirPrimeraLetraMayuscula
    })
  }catch(err){
    req.flash("error", err.message);
    return res.redirect(ROUTES.HOME);
  }
 
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

