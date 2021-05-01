const express = require("express");
const Router = express.Router();
const {mostrarEspecializaciones, mostrarEspecializacion} = require("../controllers/especializacionController");

Router.get('/especializaciones', mostrarEspecializaciones);
Router.get('/especializacion/:especializacion', mostrarEspecializacion);

module.exports = Router;