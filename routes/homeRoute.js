import express from "express";
const Router = express.Router();
import * as ROUTES from "../config/routes.js";

import * as homeController from "../controllers/homeController.js";

Router.get(ROUTES.HOME, homeController.mostrarPaginaPrincipal);

export default Router;