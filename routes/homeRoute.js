import express from "express";
const Router = express.Router();

import {mostrarPaginaPrincipal} from "../controllers/homeController.js";

Router.get('/', mostrarPaginaPrincipal);

export default Router;