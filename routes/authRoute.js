import express from "express";
const Router = express.Router();
import * as authController from "../controllers/authController.js";

Router.get('/iniciar-sesion', authController.mostrarPaginaInicioSesion);
Router.post('/iniciar-sesion', authController.iniciarSesion);

export default Router;
