const express = require("express");
const Router = express.Router();
const {mostrarPaginaPublicidad} = require('../controllers/publicidadController');

Router.get('/publicidad/', mostrarPaginaPublicidad);

module.exports = Router;