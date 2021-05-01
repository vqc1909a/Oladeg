const express = require("express");
const Router = express.Router();
const {mostrarDiplomados, mostrarDiplomado} = require("../controllers/diplomadoController");

Router.get('/diplomados', mostrarDiplomados);
Router.get('/diplomado/:diplomado', mostrarDiplomado);

module.exports = Router;