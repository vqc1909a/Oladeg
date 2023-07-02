import express from "express";
import * as authController from "../controllers/authController.js";
import * as authValidation from "../validations/authValidation.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";
import * as ROUTES from "../config/routes.js";
const Router = express.Router();

Router.get(ROUTES.LOGIN, authMiddleware.verificarUsuarioNoAutenticado, authController.mostrarPaginaIniciarSesion);
Router.post(ROUTES.LOGIN, authValidation.iniciarSesion, authController.iniciarSesion);
Router.get(ROUTES.CONFIRM_ACCOUNT, authController.confirmarCuenta);
Router.get(ROUTES.FORGOT_PASSWORD, authController.mostrarPaginaOlvidePassword);
Router.post(ROUTES.FORGOT_PASSWORD, authController.olvidePassword);
Router.get(ROUTES.RECOVER_PASSWORD, authController.mostrarPaginaRecuperarPassword);
Router.post(ROUTES.RECOVER_PASSWORD, authController.recuperarPassword);

export default Router;
