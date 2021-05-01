const express = require("express");
const Router = express.Router();
const {mostrarPaginaPrincipal, mostrarAnuncio} = require("../controllers/anuncioController");

Router.get('/', mostrarPaginaPrincipal);
Router.get('/anuncio/:anuncio', mostrarAnuncio);

module.exports = Router;