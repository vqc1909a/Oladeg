import express from "express";
const Router = express.Router();

import * as homeController from "../controllers/homeController.js";

Router.get('/', homeController.mostrarPaginaPrincipal);

export default Router;