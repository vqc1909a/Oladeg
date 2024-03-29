import * as url from 'url';
import Sequelize from "sequelize";
import path from "path";
import { validationResult } from "express-validator";
import multer from "multer";
import fse from "fs-extra";
import { storageLibros } from "../config/multer.js";

import Libro from "../models/LibroModel.js";
import User from "../models/UserModel.js";
import * as ROUTES from "../config/routes.js";
import {DateTime} from "luxon";
import { convertirPrimeraLetraMayuscula } from "../helpers/date.js";


const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const Op = Sequelize.Op;    

const upload = multer({
    storage: storageLibros,
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
          //SI existe el id, redirrecionamos a la pagina de camibo de imagen del libro
          if(req.params.id){
              return res.redirect(ROUTES.EDITAR_IMAGEN_LIBRO.replace(':id', req.params.id));
          }else{ 
              return res.redirect(ROUTES.AGREGAR_LIBRO);
          }        
      } else if (err) {
          // An unknown error occurred when uploading.
          req.flash('error', err.message);
          req.flash('fields', body);
          if(req.params.id){
              return res.redirect(ROUTES.EDITAR_IMAGEN_LIBRO.replace(':id', req.params.id));
          }else{
              return res.redirect(ROUTES.AGREGAR_LIBRO);
          }             
      }
      next();
  })
}


export const mostrarLibros = async (req, res) => {
    try{
        const libros = await Libro.findAll({order: [["updatedAt", "DESC"]]});
        const cantidadLibrosPagina = 4;
        const totalLibros = libros.length;
        const cantidadPaginas = Math.ceil(totalLibros / cantidadLibrosPagina)
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
    
        const librosFiltrados = libros.slice(cantidadLibrosPagina * (paginaActual - 1), cantidadLibrosPagina * paginaActual);
    
        
        return res.render("libro/mostrar-libros", {
          title: "Biblioteca Digital &#8211; OLADEG",
          description: "Ofrecemos documentos, libros y artículos digitales relacionados a temas de Gestión Pública y Empresarial, Planificación, Monitoreo y Evaluación de Proyectos de Desarrollo Económico Rural.",
          publicidad: '',
          libros: librosFiltrados,
          req,
          DateTime,
          convertirPrimeraLetraMayuscula,
          paginaActual,
          cantidadLibrosPagina,
          cantidadPaginas,
          totalLibros,
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
        return res.redirect(ROUTES.MOSTRAR_LIBROS);
    }
}

export const mostrarLibro = async (req, res) => {
  try{ 
    const slug = req.params.slug
    const [libros, libro] = await Promise.all([
      Libro.findAll({
        order: [["updatedAt", "DESC"]]
      }), 
      Libro.findOne({
        where: {slug},
        order: [["updatedAt", "DESC"]]
      })
    ])
    if(!libro){
        req.flash("error", "El libro no existe");
        return res.redirect(ROUTES.HOME)
    }
    const index = libros.findIndex(a => a.id === libro.id);
    const indexAnterior = index === 0 ? 0 : index - 1;
    const indexSiguiente = (index === libros.length - 1) ? index : index + 1;

    const isButtonAnterior = index > 0;
    const isButtonSiguiente = index < libros.length - 1

    let contenidoAnterior = isButtonAnterior ? libros.slice(indexAnterior, indexAnterior  + 1)[0] : undefined;
    let contenidoSiguiente = isButtonSiguiente ? libros.slice(indexSiguiente, indexSiguiente  + 1)[0] : undefined;
    
    return res.render('libro/mostrar-libro', {
        title: `${libro.titulo} &#8211; OLADEG`,
        description: libro.extracto,
        publicidad: '',
        libro,
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

export const mostrarPaginaAgregarLibro = async(req, res) => {
  const user = req.user;
  try{
    return res.render('libro/agregar-libro', {
      nombrePagina: "Agregar Libro",
      user,
      req
    })
  }catch(err){
    req.flash("error", err.message);
    return res.redirect(ROUTES.LIBROS_ADMIN)
  }
}

export const agregarLibro = async(req, res) => {
  const body = req.body;
  body.userId = req.user.id;
  if(req.files.portada){
    body.portada = `/dist/uploads/libros/portada/${req.files.portada[0].filename}`
  }
  if(req.files.archivo){
    body.archivo = `/dist/uploads/libros/archivo/${req.files.archivo[0].filename}`
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
          return res.redirect(ROUTES.AGREGAR_LIBRO);
      }
      //Create a difenrecia del Update es que create si o si necesita los campos y debe validar dichos campos, en cambio cuando usas update, sequelize interpreta que si le pasas un objeto vacio, entonces no quieres actualizar nada, pero si le pasas un objeto con algunos campos, pues te validara dichos campos según lo que pusiste en tu model
      await Libro.create(body);
      req.flash('success', 'Libro creado correctamente');
      return res.redirect(ROUTES.LIBROS_ADMIN);
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
      return res.redirect(ROUTES.AGREGAR_LIBRO);
  }
}

export const mostrarPaginaEditarLibro = async(req, res) => {
    const user = req.user;
    const users = await User.findAll({});
    try{
        let libro;
        if(user.isAdmin){
            libro = await Libro.findOne({where: {id: req.params.id}});
        }else{
            libro = await Libro.findOne({where: {id: req.params.id, userId: user.id}});
        }
        if(!libro){
            req.flash('error', 'Acceso denegado');
            return res.redirect(ROUTES.LIBROS_ADMIN);
        }
        return res.render('libro/editar-libro', {
            nombrePagina: "Editar Libro",
            user,
            req,
            libro,
            users
        })
    }catch(err){
        req.flash("error", err.message);
        return res.redirect(ROUTES.LIBROS_ADMIN)
    }
}

export const editarLibro = async(req, res) => {
    const body = req.body;
    const user = req.user;
    try{
        let libro;
        if(user.isAdmin){
            libro = await Libro.findOne({where: {id: req.params.id}});
        }else{
            libro = await Libro.findOne({where: {id: req.params.id, userId: user.id}});
        }

        //Editar un libro que no le pertenece al usuario
        if(!libro){
            req.flash('error', 'Operación no válida');
            return res.redirect(ROUTES.LIBROS_ADMIN);
        }

        let errorsExpress = validationResult(req);
        //Comprobamos si hay errores de express
        if(!errorsExpress.isEmpty()){
            const erroresExpress = errorsExpress.array().map(err => err.msg)
            req.flash('error', erroresExpress);
            req.flash('fields', body);        
            return res.redirect(ROUTES.EDITAR_LIBRO.replace(':id', req.params.id));
        }
        libro.titulo = body.titulo;
        console.log({
            body
        })
        libro.extracto = body.extracto;
        libro.autor = body.autor;
        libro.fechaPublicacion = body.fechaPublicacion;
        libro.contenido = body.contenido;
        //SOlo el admin puede cambiar el usuario de las entradas
        if(req.user.isAdmin){
            libro.userId = body.userId;
        }
        
        await libro.save();
        req.flash('success', 'Libro editado correctamente');
        return res.redirect(ROUTES.LIBROS_ADMIN);
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
        return res.redirect(ROUTES.EDITAR_LIBRO.replace(':id', req.params.id));
    }
}

export const mostrarPaginaEditarImagenLibro = async (req, res) => {
    // Group.findByPk(req.params.id);
    const user = req.user;

    try{
        let libro;
        if(user.isAdmin){
            libro = await Libro.findOne({where: {id: req.params.id}});
        }else{
            libro = await Libro.findOne({where: {id: req.params.id, userId: user.id}});
        }

        if(!libro){
            req.flash('error', 'Acceso denegado');
            return res.redirect(ROUTES.LIBROS_ADMIN);
        }
        return res.render('libro/editar-imagen-libro', {
            nombrePagina: `Editar Imagen-Archivo del Libro: ${libro.titulo}`,
            libro,
            user,
            req
        })
    }catch(err){
        req.flash('error', err.message);
        return res.redirect(ROUTES.LIBROS_ADMIN);
    }
}

export const editarImagenLibro = async (req, res) => {
    // Group.findByPk(req.params.id);
    const body = req.body; 
    const user = req.user;
    //Verificar que el usuario sube una imagen
    if(req.files.portada){
        body.portada = `/dist/uploads/libros/portada/${req.files.portada[0].filename}`
    }
     if(req.files.archivo){
        body.archivo = `/dist/uploads/libros/archivo/${req.files.archivo[0].filename}`
    }
    try{
        let libro;
        if(user.isAdmin){
            libro = await Libro.findOne({where: {id: req.params.id}});
        }else{
            libro = await Libro.findOne({where: {id: req.params.id, userId: user.id}});
        }

        if(!libro){
            req.flash('error', 'Acceso denegado');
            return res.redirect(ROUTES.LIBROS_ADMIN);
        }
       
        let previousPortada = libro.portada;
        let previousArchivo = libro.archivo;

        //Si hemos subido la imagen, lo cambiamos 
        await Libro.update(body, {
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
        return res.redirect(ROUTES.LIBROS_ADMIN);
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
        return res.redirect(ROUTES.EDITAR_IMAGEN_LIBRO.replace(':id', req.params.id));
    }
}

export const eliminarLibro = async(req, res) => {
    const user = req.user;
    try{
        let libro;
        if(user.isAdmin){
            libro = await Libro.findOne({where: {id: req.params.id}});
        }else{
            libro = await Libro.findOne({where: {id: req.params.id, userId: user.id}});
        }
        if(!libro){
            return res.status(401).json({message: "Acceso denegado"});
        }
        const filePathPortada = path.join(__dirname, `../public/${libro.portada}`);
        const filePathArchivo = path.join(__dirname, `../public/${libro.archivo}`);

        if(fse.existsSync(filePathPortada)){
            fse.unlinkSync(filePathPortada);
        }
        if(fse.existsSync(filePathArchivo)){
            fse.unlinkSync(filePathArchivo);
        }
        await Libro.destroy({where: {id: req.params.id}});
        return res.status(200).json({message: "El libro ha sido eliminado."});
    }catch(err){
        const status = err.status ? err.status : res.statusCode === 200 ? 500 : res.statusCode;
        const message = err.message;
        return res.status(status).json({message});
    }
}

