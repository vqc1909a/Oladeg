import Anuncio from "../models/AnuncioModel.js";
import User from "../models/UserModel.js";
import * as ROUTES from "../config/routes.js";
import {obtenerAnuncios, obtenerUltimaPublicidad} from "../helpers.js";


export const mostrarAnuncio = async (req, res) => {
  // const url = req.params.anuncio;
  // let anuncios = await obtenerAnuncios();
  // let anuncio = anuncios.find((anuncio) => anuncio.Url === url );
  // let anterior;
  // let despues;
  // let ubicacion
  // anuncios.forEach((anu, i) => {
  //   if(anu.Titulo === anuncio.Titulo){
  //     ubicacion = i;
  //   }
  // });
  // anterior = anuncios[ubicacion + 1];
  // despues = anuncios[ubicacion - 1];

  return res.render('anuncio/mostrar-anuncio', {
    // title: `${anuncio.Titulo} &#8211; OLADEG`,
    title: `I Primer Encuentro de Sostenibilidad en las Empresas Comunales &#8211; OLADEG`,
    // description: anuncio.metadescripcion,
    description: "",
    publicidad: ''
  })
}

export const mostrarPaginaAgregarAnuncio = async(req, res) => {
  const user = await User.findByPk(1);
  try{
    return res.render('anuncio/agregar-anuncio', {
      nombrePagina: "Agregar Anuncio",
      user,
      req
    })
  }catch(err){
    req.flash("error", err.message);
    return res.redirect(ROUTES.ANUNCIOS)
  }
}

export const agregarAnuncio = async(req, res) => {

}

export const mostrarPaginaEditarAnuncio = async(req, res) => {

}

export const editarAnuncio = async(req, res) => {

}

export const eliminarAnuncio = async(req, res) => {

}


