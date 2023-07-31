import express from "express";
import * as adminController from "../controllers/adminController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";


import * as ROUTES from "../config/routes.js";

const router = express.Router();

router.get(ROUTES.ADMIN, authMiddleware.verificarUsuarioAutenticado, adminController.mostrarPanelAdministracion);
router.get(ROUTES.USERS_ADMIN, authMiddleware.verificarUsuarioAutenticado, adminController.mostrarPanelUsuarios);
router.get(ROUTES.ANUNCIOS_ADMIN, authMiddleware.verificarUsuarioAutenticado, adminController.mostrarPanelAnuncios);
router.get(ROUTES.PROGRAMAS_ADMIN, authMiddleware.verificarUsuarioAutenticado, adminController.mostrarPanelProgramas);
router.get(ROUTES.MOSTRAR_LIBROS, authMiddleware.verificarUsuarioAutenticado, adminController.mostrarPanelLibros);





// PERFIL
// router.get(ROUTES.PERFIL, authMiddleware.verificarUsuarioAutenticado, profileController.formEditarPerfil);
// router.post(ROUTES.PERFIL, authMiddleware.verificarUsuarioAutenticado, profileController.editarPerfil);
// router.get(ROUTES.EDITAR_PASSWORD_PERFIL, authMiddleware.verificarUsuarioAutenticado, profileController.formCambiarPassword);
// router.post(ROUTES.EDITAR_PASSWORD_PERFIL, authMiddleware.verificarUsuarioAutenticado, profileValidation.cambiarPassword ,profileController.cambiarPassword);
// router.get(ROUTES.EDITAR_IMAGEN_PERFIL, authMiddleware.verificarUsuarioAutenticado, profileController.formCambiarImagenPerfil);
// router.post(ROUTES.EDITAR_IMAGEN_PERFIL, authMiddleware.verificarUsuarioAutenticado, profileController.subirImagen, profileController.cambiarImagenPerfil);
// router.get(ROUTES.CONFIRMAR_NUEVO_CORREO, authMiddleware.verificarUsuarioAutenticado, profileValidation.editarPerfil, profileController.confirmarNuevoCorreo);


export default router;
