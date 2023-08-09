import Sequelize from "sequelize";
import Anuncio from "../models/AnuncioModel.js";
import ProgramaAcademico from "../models/ProgramaAcademicoModel.js";
import Libro from "../models/LibroModel.js";
import Boletin from "../models/BoletinModel.js";
import User from "../models/UserModel.js";

import {DateTime} from "luxon";
import { convertirPrimeraLetraMayuscula } from "../helpers/date.js";

import * as ROUTES from "../config/routes.js";

const Op = Sequelize.Op; 

export const mostrarPanelAdministracion = async (req, res) =>{
    try{
        // const user = req.user;
        const user = await User.findByPk(1);
        return res.render("admin/panel", {
            nombrePagina: "Panel de Administracion",
            user,
            req
        })
    }catch(err){
        req.flash('error', err.message);
        return res.redirect(ROUTES.INICIAR_SESION);
    }
}

export const mostrarPanelUsuarios = async (req, res) => {
    try{
        // const user = req.user;
        const user = await User.findByPk(1);
        const users = await User.findAll({});

        return res.render("admin/users-panel", {
            nombrePagina: "Panel de Usuarios",
            user,
            users,
            req,
            DateTime,
            convertirPrimeraLetraMayuscula
        })
    }catch(err){
        req.flash("error", err.message);
        return res.redirect(ROUTES.ADMIN);
    }
}

export const mostrarPanelAnuncios = async (req, res) => {
    try{
        const {titulo, userId, fecha, hora} = req.query;
        
        const user = req.user;
        const users = await User.findAll({});
        let anuncios;

        let conditions = {};
        let urlConditions = ''
        if(titulo){
            conditions.titulo = {[Op.like]: `%${titulo}%`}
            urlConditions+=`&titulo=${titulo}`
        }
        if(userId){
            conditions.userId = userId
            urlConditions+=`&userId=${userId}`
        }
        if(fecha){
            conditions.fecha = fecha
            urlConditions+=`&fecha=${fecha}`
        }
        if(hora){
            conditions.hora = hora
            urlConditions+=`&hora=${hora}`
        }
        if(user.isAdmin){
            anuncios = await Anuncio.findAll({
                where: conditions,
                include: [{model: User, attributes: ['id', 'nombre', 'apellido']}],
                order: [["fechaYHora", "DESC"]]
            });
        }else{
            conditions.userId = user.id;
            anuncios = await Anuncio.findAll({
                where: conditions,
                include: [{model: User, attributes: ['id', 'nombre', 'apellido']}],
                order: [["fechaYHora", "DESC"]]
            });
        }
            
        //PAGINACION
        // const anuncios = await Anuncio.findAll({limit: cantidadAnunciosPagina, offset: cantidadAnunciosPagina * (paginaActual - 1), order: [["fechaYHora", "ASC"]]});

        const cantidadAnunciosPagina = 5;
        const totalAnuncios = anuncios.length;
        const cantidadPaginas = Math.ceil(totalAnuncios / cantidadAnunciosPagina)
        const paginaActual = Number(req.query.page ? (req.query.page >= 1 && req.query.page <= cantidadPaginas) ? req.query.page : 1 : 1) ;

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

        //ANUNCIOS
        const anunciosFiltrados = anuncios.slice(cantidadAnunciosPagina * (paginaActual - 1), cantidadAnunciosPagina * paginaActual);
        // const ultimoAnuncio = anuncios[anuncios.length - 1];
        // let fechaYHora = ultimoAnuncio.fechaYHora;
        // let fechaYHoraFormateado = fechaYHora.toLocaleString('es', { timeZone: 'America/Lima' });;

        return res.render("admin/anuncios-panel", {
            nombrePagina: "Panel de Anuncios",
            user,
            users,
            anuncios: anunciosFiltrados,
            req,
            DateTime,
            convertirPrimeraLetraMayuscula,
            paginaActual,
            cantidadAnunciosPagina,
            cantidadPaginas,
            totalAnuncios,
            arrayPaginas,
            isPaginacionesNormal,
            isPaginacionesIzquierda,
            isPaginacionesMedia,
            isPaginacionesDerecha,
            isPaginacionAnterior,
            isPaginacionSiguiente,
            urlConditions
        })
    }catch(err){
        req.flash("error", err.message);
        return res.redirect(ROUTES.ADMIN);
    }
}

export const mostrarPanelProgramas = async (req, res) => {
    try{
        const {titulo, userId, tipo, modalidad, fecha} = req.query;
        
        const user = req.user;
        const users = await User.findAll({});
        let programas;

        let conditions = {};
        let urlConditions = ''
        if(titulo){
            conditions.titulo = {[Op.like]: `%${titulo}%`}
            urlConditions+=`&titulo=${titulo}`
        }
        if(userId){
            conditions.userId = userId
            urlConditions+=`&userId=${userId}`
        }
        if(fecha){
            conditions.fecha = fecha
            urlConditions+=`&fecha=${fecha}`
        }
        if(modalidad){
            conditions.modalidad = modalidad
            urlConditions+=`&modalidad=${modalidad}`
        }
        if(tipo !== "diplomado" && tipo !== "especializacion"){
            conditions.tipo = "curso"
            urlConditions+=`&tipo=curso`
        }else{
            conditions.tipo = tipo;
            urlConditions+=`&tipo=${tipo}`
        }
        if(user.isAdmin){
            programas = await ProgramaAcademico.findAll({
                where: conditions,
                include: [{model: User, attributes: ['id', 'nombre', 'apellido']}],
                order: [["fechaYHora", "DESC"]]
            });
        }else{
            conditions.userId = user.id;
            programas = await ProgramaAcademico.findAll({
                where: conditions,
                include: [{model: User, attributes: ['id', 'nombre', 'apellido']}],
                order: [["fechaYHora", "DESC"]]
            });
        }
       
        //PAGINACION
        // const anuncios = await Anuncio.findAll({limit: cantidadAnunciosPagina, offset: cantidadAnunciosPagina * (paginaActual - 1), order: [["fechaYHora", "ASC"]]});

        const cantidadProgramasPagina = 5;
        const totalProgramas = programas.length;
        const cantidadPaginas = Math.ceil(totalProgramas / cantidadProgramasPagina)
        const paginaActual = Number(req.query.page ? (req.query.page >= 1 && req.query.page <= cantidadPaginas) ? req.query.page : 1 : 1) ;

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

        //ANUNCIOS
        const programasFiltrados = programas.slice(cantidadProgramasPagina * (paginaActual - 1), cantidadProgramasPagina * paginaActual);
        // const ultimoAnuncio = anuncios[anuncios.length - 1];
        // let fechaYHora = ultimoAnuncio.fechaYHora;
        // let fechaYHoraFormateado = fechaYHora.toLocaleString('es', { timeZone: 'America/Lima' });;

        return res.render("admin/programas-panel", {
            nombrePagina: "Panel de Programas Académicos",
            user,
            users,
            programas: programasFiltrados,
            req,
            DateTime,
            convertirPrimeraLetraMayuscula,
            paginaActual,
            cantidadProgramasPagina,
            cantidadPaginas,
            totalProgramas,
            arrayPaginas,
            isPaginacionesNormal,
            isPaginacionesIzquierda,
            isPaginacionesMedia,
            isPaginacionesDerecha,
            isPaginacionAnterior,
            isPaginacionSiguiente,
            urlConditions,
        })
    }catch(err){
        req.flash("error", err.message);
        return res.redirect(ROUTES.ADMIN);
    }
}

export const mostrarPanelLibros = async (req, res) => {
    try{
        const {titulo, userId, autor, fechaPublicacion} = req.query;
        
        const user = req.user;
        const users = await User.findAll({});
        let libros;

        let conditions = {};
        let urlConditions = ''
        if(titulo){
            conditions.titulo = {[Op.like]: `%${titulo}%`}
            urlConditions+=`&titulo=${titulo}`
        }
        if(userId){
            conditions.userId = userId
            urlConditions+=`&userId=${userId}`
        }
        if(autor){
            conditions.autor = {[Op.like]: `%${autor}%`} 
            urlConditions+=`&autor=${autor}`
        }
        if(fechaPublicacion){
            conditions.fechaPublicacion = fechaPublicacion
            urlConditions+=`&fechaPublicacion=${fechaPublicacion}`
        }
        if(user.isAdmin){
            libros = await Libro.findAll({
                where: conditions,
                include: [{model: User, attributes: ['id', 'nombre', 'apellido']}],
                order: [["updatedAt", "DESC"]]
            });
        }else{
            conditions.userId = user.id;
            libros = await Libro.findAll({
                where: conditions,
                include: [{model: User, attributes: ['id', 'nombre', 'apellido']}],
                order: [["updatedAt", "DESC"]]
            });
        }
            
        //PAGINACION
        // const anuncios = await Anuncio.findAll({limit: cantidadAnunciosPagina, offset: cantidadAnunciosPagina * (paginaActual - 1), order: [["fechaYHora", "ASC"]]});

        const cantidadLibrosPagina = 4;
        const totalLibros = libros.length;
        const cantidadPaginas = Math.ceil(totalLibros / cantidadLibrosPagina)
        const paginaActual = Number(req.query.page ? (req.query.page >= 1 && req.query.page <= cantidadPaginas) ? req.query.page : 1 : 1) ;

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

        //ANUNCIOS
        const librosFiltrados = libros.slice(cantidadLibrosPagina * (paginaActual - 1), cantidadLibrosPagina * paginaActual);

        return res.render("admin/libros-panel", {
            nombrePagina: "Panel de Libros",
            user,
            users,
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
            urlConditions
        })
    }catch(err){
        req.flash("error", err.message);
        return res.redirect(ROUTES.ADMIN);
    }
}

export const mostrarPanelBoletines = async (req, res) => {
    try{
        const {titulo, userId, autor, fechaPublicacion} = req.query;
        
        const user = req.user;
        const users = await User.findAll({});
        let boletines;

        let conditions = {};
        let urlConditions = ''
        if(titulo){
            conditions.titulo = {[Op.like]: `%${titulo}%`}
            urlConditions+=`&titulo=${titulo}`
        }
        if(userId){
            conditions.userId = userId
            urlConditions+=`&userId=${userId}`
        }
        if(autor){
            conditions.autor = {[Op.like]: `%${autor}%`} 
            urlConditions+=`&autor=${autor}`
        }
        if(fechaPublicacion){
            conditions.fechaPublicacion = fechaPublicacion
            urlConditions+=`&fechaPublicacion=${fechaPublicacion}`
        }
        if(user.isAdmin){
            boletines = await Boletin.findAll({
                where: conditions,
                include: [{model: User, attributes: ['id', 'nombre', 'apellido']}],
                order: [["updatedAt", "DESC"]]
            });
        }else{
            conditions.userId = user.id;
            boletines = await Boletin.findAll({
                where: conditions,
                include: [{model: User, attributes: ['id', 'nombre', 'apellido']}],
                order: [["updatedAt", "DESC"]]
            });
        }
            
        //PAGINACION
        // const anuncios = await Anuncio.findAll({limit: cantidadAnunciosPagina, offset: cantidadAnunciosPagina * (paginaActual - 1), order: [["fechaYHora", "ASC"]]});

        const cantidadBoletinesPagina = 4;
        const totalBoletines = boletines.length;
        const cantidadPaginas = Math.ceil(totalBoletines / cantidadBoletinesPagina)
        const paginaActual = Number(req.query.page ? (req.query.page >= 1 && req.query.page <= cantidadPaginas) ? req.query.page : 1 : 1) ;

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

        //ANUNCIOS
        const boletinesFiltrados = boletines.slice(cantidadBoletinesPagina * (paginaActual - 1), cantidadBoletinesPagina * paginaActual);

        return res.render("admin/boletines-panel", {
            nombrePagina: "Panel de boletines",
            user,
            users,
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
            urlConditions
        })
    }catch(err){
        req.flash("error", err.message);
        return res.redirect(ROUTES.ADMIN);
    }
}


