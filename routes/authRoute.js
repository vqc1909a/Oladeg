import express from "express";
import * as authController from "../controllers/authController.js";
import * as authValidation from "../validations/authValidation.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";
import * as ROUTES from "../config/routes.js";
const Router = express.Router();

Router.get(ROUTES.LOGIN, authMiddleware.verificarUsuarioNoAutenticado, authController.mostrarPaginaIniciarSesion);
Router.post(ROUTES.LOGIN, authMiddleware.verificarUsuarioNoAutenticado, authValidation.iniciarSesion, authController.iniciarSesion);
Router.get(ROUTES.FORGOT_PASSWORD, authMiddleware.verificarUsuarioNoAutenticado, authController.mostrarPaginaOlvidePassword);
Router.post(ROUTES.FORGOT_PASSWORD, authMiddleware.verificarUsuarioNoAutenticado, /* validation  */ authController.olvidePassword);
Router.get(ROUTES.RECOVER_PASSWORD, authMiddleware.verificarUsuarioNoAutenticado, authController.mostrarPaginaRecuperarPassword);
Router.post(ROUTES.RECOVER_PASSWORD, authMiddleware.verificarUsuarioNoAutenticado, /* validation */authController.recuperarPassword);

Router.get(ROUTES.CONFIRM_ACCOUNT, authController.confirmarCuenta);

export default Router;
