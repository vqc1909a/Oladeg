const express = require("express");
const Router = express.Router();
const {
  mostrarPaginaConsultorias, 
  mostrarPaginaQuienesSomos,
  mostrarPaginaNuestraExperiencia,
  mostrarPaginaNuestrosServicios,
  mostrarPaginaFormasDePago,
  mostrarPaginaContacto
} = require("../controllers/infoController");


Router.get('/consultorias', mostrarPaginaConsultorias);
Router.get('/quienes-somos', mostrarPaginaQuienesSomos);
Router.get('/nuestra-experiencia', mostrarPaginaNuestraExperiencia);
Router.get('/nuestros-servicios', mostrarPaginaNuestrosServicios);
Router.get('/formas-de-pago', mostrarPaginaFormasDePago);
Router.get('/contacto', mostrarPaginaContacto);






module.exports = Router;