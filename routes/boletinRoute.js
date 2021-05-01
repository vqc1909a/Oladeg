const express = require("express");
const Router = express.Router();
const {mostrarBoletines, mostrarBoletin} = require('../controllers/boletinController');

Router.get('/boletines', mostrarBoletines);

Router.get('/boletin/:boletin', mostrarBoletin);
module.exports = Router;
