import express from "express";
const Router = express.Router();
import * as ROUTES from "../config/routes.js";
import * as anuncioController from "../controllers/anuncioController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";


Router.get(ROUTES.MOSTRAR_ANUNCIO, anuncioController.mostrarAnuncio);
Router.get(ROUTES.AGREGAR_ANUNCIO, /* authMiddleware.verificarUsuarioAutenticado, */ anuncioController.mostrarPaginaAgregarAnuncio);
Router.post(ROUTES.AGREGAR_ANUNCIO, /* authMiddleware.verificarUsuarioAutenticado, */ anuncioController.agregarAnuncio);
Router.get(ROUTES.EDITAR_ANUNCIO, /* authMiddleware.verificarUsuarioAutenticado, */ anuncioController.mostrarPaginaEditarAnuncio);
Router.post(ROUTES.EDITAR_ANUNCIO, /* authMiddleware.verificarUsuarioAutenticado, */ anuncioController.editarAnuncio);
Router.post(ROUTES.ELIMINAR_ANUNCIO, /* authMiddleware.verificarUsuarioAutenticado, */ anuncioController.eliminarAnuncio);


export default Router;
