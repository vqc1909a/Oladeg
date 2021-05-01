const express = require("express");
const Router = express.Router();
const {mostrarCursos, mostrarCurso} = require("../controllers/cursoController");

Router.get('/cursos', mostrarCursos);
Router.get('/curso/:curso', mostrarCurso);

module.exports = Router;