import Sequelize from "sequelize";
import Anuncio from "../models/AnuncioModel.js";
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
        console.log({
            urlConditions
        })
        if(user.isAdmin){
            anuncios = await Anuncio.findAll({
                where: conditions,
                include: [{model: User, attributes: ['id', 'nombre', 'apellido']}],
                order: [["fechaYHora", "ASC"]]
            });
        }else{
            conditions.userId = user.id;
            anuncios = await Anuncio.findAll({
                where: conditions,
                include: [{model: User, attributes: ['id', 'nombre', 'apellido']}],
                order: [["fechaYHora", "ASC"]]
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
        // let fechaYHoraFormateado = fechaYHora.toLocaleString('es-ES', { timeZone: 'America/Lima' });;

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
