const express = require("express");
const Router = express.Router();
const {mostrarLibros, mostrarLibro} = require('../controllers/libroController');

Router.get('/libros/', mostrarLibros);

Router.get('/libro/:libro', mostrarLibro)
module.exports = Router;
