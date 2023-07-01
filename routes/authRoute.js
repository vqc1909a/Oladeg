import express from "express";
import * as authController from "../controllers/authController.js";

const Router = express.Router();

Router.get('/iniciar-sesion', authController.mostrarPaginaInicioSesion);
Router.post('/iniciar-sesion', authController.iniciarSesion);

export default Router;
