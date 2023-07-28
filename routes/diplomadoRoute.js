import express from "express";
import {mostrarDiplomados, mostrarDiplomado} from "../controllers/diplomadoController.js";
import * as ROUTES from "../config/routes.js";

const Router = express.Router();

Router.get(ROUTES.MOSTRAR_DIPLOMADOS, mostrarDiplomados);
Router.get(ROUTES.MOSTRAR_DIPLOMADO, mostrarDiplomado);

export default Router;
