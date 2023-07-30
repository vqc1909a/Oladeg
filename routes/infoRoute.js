import express from "express";
const Router = express.Router();
import * as ROUTES from "../config/routes.js";
import * as infoController from "../controllers/infoController.js";

Router.get(ROUTES.MOSTRAR_CONSULTORIAS, infoController.mostrarPaginaConsultorias);
Router.get(ROUTES.MOSTRAR_QUIENES_SOMOS, infoController.mostrarPaginaQuienesSomos);
Router.get(ROUTES.MOSTRAR_NUESTRA_EXPERIENCIA, infoController.mostrarPaginaNuestraExperiencia);
Router.get(ROUTES.MOSTRAR_NUESTROS_SERVICIOS, infoController.mostrarPaginaNuestrosServicios);
Router.get(ROUTES.MOSTRAR_FORMAS_DE_PAGO, infoController.mostrarPaginaFormasDePago);
Router.get(ROUTES.MOSTRAR_CONTACTO, infoController.mostrarPaginaContacto);
Router.post(ROUTES.ENVIAR_MENSAJE, infoController.enviarMensaje);

export default Router;
