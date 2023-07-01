import express from "express";
const Router = express.Router();
import * as ROUTES from "../config/routes.js";
import * as anuncioController from "../controllers/anuncioController.js";

Router.get(ROUTES.MOSTRAR_ANUNCIO, anuncioController.mostrarAnuncio);

export default Router;
