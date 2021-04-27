const express = require("express");
const Router = express.Router();
const {
  mostrarPaginaPrincipal, 
  mostrarPaginaConsultorias, 
  mostrarPaginaQuienesSomos,
  mostrarPaginaNuestraExperiencia,
  mostrarPaginaNuestrosServicios,
  mostrarPaginaFormasDePago,
  mostrarPaginaContacto,
  mostrarPaginaCursos,
  mostrarPaginaDiplomados,
  mostrarPaginaEspecializaciones
} = require("../controllers/infoController");


Router.get('/', mostrarPaginaPrincipal);
Router.get('/consultorias', mostrarPaginaConsultorias);
Router.get('/quienes-somos', mostrarPaginaQuienesSomos);
Router.get('/nuestra-experiencia', mostrarPaginaNuestraExperiencia);
Router.get('/nuestros-servicios', mostrarPaginaNuestrosServicios);
Router.get('/formas-de-pago', mostrarPaginaFormasDePago);
Router.get('/contacto', mostrarPaginaContacto);
Router.get('/cursos', mostrarPaginaCursos);
Router.get('/diplomados', mostrarPaginaDiplomados);
Router.get('/especializaciones', mostrarPaginaEspecializaciones);


Router.get('/curso/:curso', (req, res) => {
  return res.render('pages/cursoView', {
    title: "Implementación del Sistema de Gestion de Seguridad y Salud Ocupacional &#8211; OLADEG",
    description: "Las necesidades en infraestructura, bienes inmuebles, equipos y maquinarias, insumos, medicamentos y personal, mostraron la real situación carente que se encuentra el Estado, todo esto por resolver de manera inmediata.",
    protocol: req.protocol, 
    host: req.headers.host,
  })
})
Router.get('/diplomado/:diplomado', (req, res) => {
  return res.render('pages/diplomadoView', {
    title: "Inventario de Bienes Inmuebles en el Sector Público &#8211; OLADEG",
    description: "Las necesidades en infraestructura, bienes inmuebles, equipos y maquinarias, insumos, medicamentos y personal, mostraron la real situación carente que se encuentra el Estado, todo esto por resolver de manera inmediata.",
    protocol: req.protocol, 
    host: req.headers.host,
  })
})
Router.get('/especializacion/:especializacion', (req, res) => {
  return res.render('pages/especializacionView', {
    title: "Inventario de Bienes Inmuebles en el Sector Público &#8211; OLADEG",
    description: "Las necesidades en infraestructura, bienes inmuebles, equipos y maquinarias, insumos, medicamentos y personal, mostraron la real situación carente que se encuentra el Estado, todo esto por resolver de manera inmediata.",
    protocol: req.protocol, 
    host: req.headers.host,
  })
})

Router.get('/anuncio/:anuncio', (req, res) => {
  return res.render('pages/anuncioView', {
    title: "I Encuentro de Sostenibilidad en las Empresas Comunales &#8211; OLADEG",
    protocol: req.protocol, 
    //Pones aqui su descripcion
    description: '',
    host: req.headers.host,
  })
})

Router.get('/boletines', (req, res) => {
  return res.render('pages/boletinesView', {
    title: "Boletines &#8211; OLADEG",
    protocol: req.protocol, 
    description: '',
    host: req.headers.host,
  })
})

Router.get('/boletin/:boletin', (req, res) => {
  return res.render('pages/boletinView', {
    title: "Gestión Estratégica para el Desarrollo Regional &#8211; OLADEG",
    protocol: req.protocol, 
    //Pones aqui su descripcion
    description: '',
    host: req.headers.host
  })
})

Router.get('/libros/', (req, res) => {
  return res.render('pages/librosView', {
    title: "Biblioteca Digital &#8211; OLADEG",
    protocol: req.protocol, 
    description: '',
    host: req.headers.host
  })
})

Router.get('/libro/:libro', (req, res) => {
  return res.render('pages/libroView', {
    title: "Implementación del Sistema de Gestion de Seguridad y Salud Ocupacional &#8211; OLADEG",
    protocol: req.protocol, 
    //Pones aqui su descripcion
    description: '',
    host: req.headers.host
  })
})


module.exports = Router;