import express from "express";
const Router = express.Router();
import * as infoController from "../controllers/infoController.js";


Router.get('/consultorias', infoController.mostrarPaginaConsultorias);
Router.get('/quienes-somos', infoController.mostrarPaginaQuienesSomos);
Router.get('/nuestra-experiencia', infoController.mostrarPaginaNuestraExperiencia);
Router.get('/nuestros-servicios', infoController.mostrarPaginaNuestrosServicios);
Router.get('/formas-de-pago', infoController.mostrarPaginaFormasDePago);
Router.get('/contacto', infoController.mostrarPaginaContacto);

export default Router;
