import express from "express";
import {mostrarEspecializaciones, mostrarEspecializacion}  from "../controllers/especializacionController.js";
import * as ROUTES from "../config/routes.js";

const Router = express.Router();

Router.get(ROUTES.MOSTRAR_ESPECIALIZACIONES, mostrarEspecializaciones);
Router.get(ROUTES.MOSTRAR_ESPECIALIZACION, mostrarEspecializacion);

export default Router;