import express from "express";
import {mostrarPaginaPublicidad} from '../controllers/publicidadController.js';

const Router = express.Router();

Router.get('/publicidad/', mostrarPaginaPublicidad);

export default Router;