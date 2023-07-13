import express from "express";
import {mostrarCursos, mostrarCurso} from "../controllers/cursoController.js";
import * as ROUTES from "../config/routes.js";

const Router = express.Router();

Router.get(ROUTES.MOSTRAR_CURSOS, mostrarCursos);
Router.get(ROUTES.MOSTRAR_CURSO, mostrarCurso);

export default Router;
