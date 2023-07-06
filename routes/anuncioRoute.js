import express from "express";
const Router = express.Router();
import * as ROUTES from "../config/routes.js";
import * as anuncioController from "../controllers/anuncioController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

import * as anuncioValidation from "../validations/anuncioValidation.js"

Router.get(ROUTES.MOSTRAR_ANUNCIO, anuncioController.mostrarAnuncio);
Router.get(ROUTES.AGREGAR_ANUNCIO, authMiddleware.verificarUsuarioAutenticado, anuncioController.mostrarPaginaAgregarAnuncio);
Router.post(ROUTES.AGREGAR_ANUNCIO, authMiddleware.verificarUsuarioAutenticado, anuncioController.subirImagen, anuncioValidation.agregarAnuncio, anuncioController.agregarAnuncio);

Router.get(ROUTES.EDITAR_ANUNCIO, authMiddleware.verificarUsuarioAutenticado, anuncioController.mostrarPaginaEditarAnuncio);
Router.post(ROUTES.EDITAR_ANUNCIO, authMiddleware.verificarUsuarioAutenticado, anuncioValidation.editarAnuncio, anuncioController.editarAnuncio);

Router.get(ROUTES.EDITAR_IMAGEN_ANUNCIO, authMiddleware.verificarUsuarioAutenticado, anuncioController.mostrarPaginaEditarImagenAnuncio);
Router.post(ROUTES.EDITAR_IMAGEN_ANUNCIO, authMiddleware.verificarUsuarioAutenticado,anuncioController.subirImagen, anuncioController.editarImagenAnuncio);

Router.delete(ROUTES.ELIMINAR_ANUNCIO, authMiddleware.verificarUsuarioAutenticado, anuncioController.eliminarAnuncio);


export default Router;
