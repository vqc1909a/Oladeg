
import express from "express";
import * as ROUTES from "../config/routes.js";
import * as libroController from "../controllers/libroController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";
import * as libroValidation from "../validations/libroValidation.js"

const Router = express.Router();

Router.get(ROUTES.MOSTRAR_LIBROS, libroController.mostrarLibros);
Router.get(ROUTES.MOSTRAR_LIBRO, libroController.mostrarLibro);

Router.get(ROUTES.AGREGAR_LIBRO, authMiddleware.verificarUsuarioAutenticado, libroController.mostrarPaginaAgregarLibro);
Router.post(ROUTES.AGREGAR_LIBRO, authMiddleware.verificarUsuarioAutenticado, libroController.subirImagen, libroValidation.agregarLibro, libroController.agregarLibro);

Router.get(ROUTES.EDITAR_LIBRO, authMiddleware.verificarUsuarioAutenticado, libroController.mostrarPaginaEditarLibro);
Router.post(ROUTES.EDITAR_LIBRO, authMiddleware.verificarUsuarioAutenticado, libroValidation.editarLibro, libroController.editarLibro);

Router.get(ROUTES.EDITAR_IMAGEN_LIBRO, authMiddleware.verificarUsuarioAutenticado, libroController.mostrarPaginaEditarImagenLibro);
Router.post(ROUTES.EDITAR_IMAGEN_LIBRO, authMiddleware.verificarUsuarioAutenticado, libroController.subirImagen, libroController.editarImagenLibro);

Router.delete(ROUTES.ELIMINAR_LIBRO, authMiddleware.verificarUsuarioAutenticado, libroController.eliminarLibro);


export default Router;
