const express = require("express");
const Router = express.Router();
const {mostrarAnuncio} = require("../controllers/anuncioController");

Router.get('/anuncio/:anuncio', mostrarAnuncio);

module.exports = Router;