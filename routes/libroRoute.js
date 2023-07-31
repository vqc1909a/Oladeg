import express from "express";
import * as ROUTES from "../config/routes.js";

const {mostrarLibros, mostrarLibro} = require('../controllers/libroController.js');

const Router = express.Router();
Router.get(ROUTES.MOSTRAR_LIBROS, mostrarLibros);
Router.get(ROUTES.MOSTRAR_LIBRO, mostrarLibro);

export default Router;
