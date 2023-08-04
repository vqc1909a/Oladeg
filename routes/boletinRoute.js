import express from "express";
import * as ROUTES from "../config/routes.js";
import * as boletinController from "../controllers/boletinController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";
import * as boletinValidation from "../validations/boletinValidation.js"

const Router = express.Router();

Router.get(ROUTES.MOSTRAR_BOLETINES, boletinController.mostrarBoletines);
Router.get(ROUTES.MOSTRAR_BOLETIN, boletinController.mostrarBoletin);

Router.get(ROUTES.AGREGAR_BOLETIN, authMiddleware.verificarUsuarioAutenticado, boletinController.mostrarPaginaAgregarBoletin);
Router.post(ROUTES.AGREGAR_BOLETIN, authMiddleware.verificarUsuarioAutenticado, boletinController.subirImagen, boletinValidation.agregarBoletin, boletinController.agregarBoletin);

Router.get(ROUTES.EDITAR_BOLETIN, authMiddleware.verificarUsuarioAutenticado, boletinController.mostrarPaginaEditarBoletin);
Router.post(ROUTES.EDITAR_BOLETIN, authMiddleware.verificarUsuarioAutenticado, boletinValidation.editarBoletin, boletinController.editarBoletin);

Router.get(ROUTES.EDITAR_IMAGEN_BOLETIN, authMiddleware.verificarUsuarioAutenticado, boletinController.mostrarPaginaEditarImagenBoletin);
Router.post(ROUTES.EDITAR_IMAGEN_BOLETIN, authMiddleware.verificarUsuarioAutenticado, boletinController.subirImagen, boletinController.editarImagenBoletin);

Router.delete(ROUTES.ELIMINAR_BOLETIN, authMiddleware.verificarUsuarioAutenticado, boletinController.eliminarBoletin);


export default Router;

