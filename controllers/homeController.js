import Anuncio from "../models/AnuncioModel.js";
import * as ROUTES from "../config/routes.js";
import {DateTime} from "luxon";
import { convertirPrimeraLetraMayuscula } from "../helpers/date.js";

export const mostrarPaginaPrincipal = async (req, res) => {
  try{
    const anuncios = await Anuncio.findAll({order: [["fechaYHora", "ASC"]]});
    const cantidadAnunciosPagina = 4;
    const totalAnuncios = anuncios.length;
    const cantidadPaginas = Math.ceil(totalAnuncios / cantidadAnunciosPagina)
    const paginaActual = Number(req.query.page ? (req.query.page >= 1 && req.query.page <= cantidadPaginas) ? req.query.page : 1 : 1)

    const isPaginacionesNormal = (cantidadPaginas <= 5) && (paginaActual <= 5) // 5 paginaciones del 1 al 5 o menos según la cantidad de paginas
    const isPaginacionesIzquierda = (cantidadPaginas > 5) && (paginaActual <= 3); // 5 paginaciones del 1 2 3 ... final
    const isPaginacionesMedia = (cantidadPaginas > 5) && (paginaActual > 3) && (paginaActual < cantidadPaginas - 2) // 5 paginaciones del 1 ... 4 ... final
    const isPaginacionesDerecha = (cantidadPaginas > 5) && (paginaActual >= cantidadPaginas - 2)

    const isPaginacionAnterior = paginaActual > 1;
    const isPaginacionSiguiente = paginaActual < cantidadPaginas;
    console.log({
      isPaginacionAnterior,
      isPaginacionSiguiente
    })
    const arrayPaginas = [];
    for (var i = 1; i <= cantidadPaginas; i++) {
        arrayPaginas.push(i); // Agrega cada número al array
    }

    const anunciosFiltrados = anuncios.slice(cantidadAnunciosPagina * (paginaActual - 1), cantidadAnunciosPagina * paginaActual);

    
    return res.render("pages/home", {
      title: "OLADEG &#8211; Desarrollo Rural y Gobiernos Locales",
      description: "Oladeg es una ONG que va dirigido a los ciudadanos, líderes sociales, autoridades y funcionarios de gobiernos locales, regionales y organizacionales con la finalidad de contribuir al Buen Gobierno en los diferentes niveles.",
      publicidad: '',
      anuncios: anunciosFiltrados,
      req,
      DateTime,
      convertirPrimeraLetraMayuscula,
      paginaActual,
      cantidadAnunciosPagina,
      cantidadPaginas,
      totalAnuncios,
      arrayPaginas,
      isPaginacionesNormal,
      isPaginacionesIzquierda,
      isPaginacionesMedia,
      isPaginacionesDerecha,
      isPaginacionAnterior,
      isPaginacionSiguiente,
    });
  }catch(err){

  }
 
}