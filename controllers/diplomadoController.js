
import ProgramaAcademico from "../models/ProgramaAcademicoModel.js";
import * as ROUTES from "../config/routes.js";
import {DateTime} from "luxon";
import { convertirPrimeraLetraMayuscula } from "../helpers/date.js";

export const mostrarDiplomados = async (req, res) => {
  try{
    const diplomados = await ProgramaAcademico.findAll({where: {tipo: 'diplomado'}, order: [["fechaYHora", "DESC"]]});
    const cantidadDiplomadosPagina = 4;
    const totalDiplomados = diplomados.length;
    const cantidadPaginas = Math.ceil(totalDiplomados / cantidadDiplomadosPagina)
    const paginaActual = Number(req.query.page ? (req.query.page >= 1 && req.query.page <= cantidadPaginas) ? req.query.page : 1 : 1)

    const isPaginacionesNormal = (cantidadPaginas <= 5) && (paginaActual <= 5) // 5 paginaciones del 1 al 5 o menos según la cantidad de paginas
    const isPaginacionesIzquierda = (cantidadPaginas > 5) && (paginaActual <= 3); // 5 paginaciones del 1 2 3 ... final
    const isPaginacionesMedia = (cantidadPaginas > 5) && (paginaActual > 3) && (paginaActual < cantidadPaginas - 2) // 5 paginaciones del 1 ... 4 ... final
    const isPaginacionesDerecha = (cantidadPaginas > 5) && (paginaActual >= cantidadPaginas - 2)

    const isPaginacionAnterior = paginaActual > 1;
    const isPaginacionSiguiente = paginaActual < cantidadPaginas;
    const arrayPaginas = [];
    for (var i = 1; i <= cantidadPaginas; i++) {
      arrayPaginas.push(i); // Agrega cada número al array
    }

    const diplomadosFiltrados = diplomados.slice(cantidadDiplomadosPagina * (paginaActual - 1), cantidadDiplomadosPagina * paginaActual);

    return res.render("programa/mostrar-diplomados", {
      title: "Diplomados &#8211; OLADEG",
      description: "Oladeg te invita a participar de los Diplomados de Capacitación a Distancia Virtual mediante su Escuela de Gestión Pública.",
      publicidad: '',
      diplomados: diplomadosFiltrados,
      req,
      DateTime,
      convertirPrimeraLetraMayuscula,
      paginaActual,
      cantidadDiplomadosPagina,
      cantidadPaginas,
      totalDiplomados,
      arrayPaginas,
      isPaginacionesNormal,
      isPaginacionesIzquierda,
      isPaginacionesMedia,
      isPaginacionesDerecha,
      isPaginacionAnterior,
      isPaginacionSiguiente,
    });
  }catch(err){
    req.flash("error", err.message);
    return res.redirect(ROUTES.HOME);
  }
}

export const mostrarDiplomado = async (req, res) => {
  try{
    const slug = req.params.slug
    const [diplomados, diplomado] = await Promise.all([
      ProgramaAcademico.findAll({
        where: {tipo: "diplomado"},
        order: [["fechaYHora", "DESC"]]
      }), 
      ProgramaAcademico.findOne({
        where: {slug, tipo: 'diplomado'}, 
        order: [["fechaYHora", "DESC"]]
      })
    ])
    if(!diplomado){
        req.flash("error", "El diplomado no existe");
        return res.redirect(ROUTES.HOME)
    }
    const index = diplomados.findIndex(a => a.id === diplomado.id);
    const indexAnterior = index === 0 ? 0 : index - 1;
    const indexSiguiente = (index === diplomados.length - 1) ? index : index + 1;

    const isButtonAnterior = index > 0;
    const isButtonSiguiente = index < diplomados.length - 1

    let contenidoAnterior = isButtonAnterior ? diplomados.slice(indexAnterior, indexAnterior  + 1)[0] : undefined;
    let contenidoSiguiente = isButtonSiguiente ? diplomados.slice(indexSiguiente, indexSiguiente  + 1)[0] : undefined;
    

    const extracto = diplomado.descripcion.trim().split(/\s+/).slice(0, 35).join(' ');
    return res.render('programa/mostrar-diplomado', {
        title: `${diplomado.titulo} &#8211; OLADEG`,
        description: extracto,
        publicidad: '',
        diplomado,
        isButtonAnterior,
        isButtonSiguiente,
        contenidoAnterior,
        contenidoSiguiente,
        DateTime,
        convertirPrimeraLetraMayuscula
    })
  }catch(err){
    req.flash("error", err.message);
    return res.redirect(ROUTES.HOME);
  }
}

