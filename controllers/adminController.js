import Anuncio from "../models/AnuncioModel.js";
import User from "../models/UserModel.js";

import * as ROUTES from "../config/routes.js";

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
            req
        })
    }catch(err){
        req.flash("error", err.message);
        return res.redirect(ROUTES.ADMIN);
    }
}

export const mostrarPanelAnuncios = async (req, res) => {
     try{
        // const user = req.user;
        const user = await User.findByPk(1);
        const anuncios = await Anuncio.findAll({});

        return res.render("admin/anuncios-panel", {
            nombrePagina: "Panel de Anuncios",
            user,
            anuncios,
            req
        })
    }catch(err){
        req.flash("error", err.message);
        return res.redirect(ROUTES.ADMIN);
    }
}
