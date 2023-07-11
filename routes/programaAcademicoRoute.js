import express from "express";
const Router = express.Router();
import * as ROUTES from "../config/routes.js";
import * as programaAcademicoController from "../controllers/programaAcademicoController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

import * as programaAcademicoValidation from "../validations/programaAcademicoValidation.js"

Router.get(ROUTES.AGREGAR_PROGRAMA, authMiddleware.verificarUsuarioAutenticado, programaAcademicoController.mostrarPaginaAgregarPrograma);
Router.post(ROUTES.AGREGAR_PROGRAMA, authMiddleware.verificarUsuarioAutenticado, programaAcademicoController.subirImagen, programaAcademicoValidation.agregarPrograma, programaAcademicoController.agregarPrograma);

Router.get(ROUTES.EDITAR_PROGRAMA, authMiddleware.verificarUsuarioAutenticado, programaAcademicoController.mostrarPaginaEditarPrograma);
Router.post(ROUTES.EDITAR_PROGRAMA, authMiddleware.verificarUsuarioAutenticado, programaAcademicoValidation.editarPrograma, programaAcademicoController.editarPrograma);

Router.get(ROUTES.EDITAR_IMAGEN_PROGRAMA, authMiddleware.verificarUsuarioAutenticado, programaAcademicoController.mostrarPaginaEditarImagenPrograma);
Router.post(ROUTES.EDITAR_IMAGEN_PROGRAMA, authMiddleware.verificarUsuarioAutenticado,programaAcademicoController.subirImagen, programaAcademicoController.editarImagenPrograma);

Router.delete(ROUTES.ELIMINAR_PROGRAMA, authMiddleware.verificarUsuarioAutenticado, programaAcademicoController.eliminarPrograma);


export default Router;
