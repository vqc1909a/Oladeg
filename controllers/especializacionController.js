import ProgramaAcademico from "../models/ProgramaAcademicoModel.js";
import * as ROUTES from "../config/routes.js";
import {DateTime} from "luxon";
import { convertirPrimeraLetraMayuscula } from "../helpers/date.js";

export const mostrarEspecializaciones = async (req, res) => {
  try{
    const especializaciones = await ProgramaAcademico.findAll({where: {tipo: 'especializacion'}, order: [["fechaYHora", "ASC"]]});
    const cantidadEspecializacionesPagina = 4;
    const totalEspecializaciones = especializaciones.length;
    const cantidadPaginas = Math.ceil(totalEspecializaciones / cantidadEspecializacionesPagina)
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

    const especializacionesFiltrados = especializaciones.slice(cantidadEspecializacionesPagina * (paginaActual - 1), cantidadEspecializacionesPagina * paginaActual);

    return res.render("programa/mostrar-especializaciones", {
      title: "Especializaciones &#8211; OLADEG",
      description: "Oladeg te invita a participar de las Especializaciones de Capacitación a Distancia Virtual mediante su Escuela de Gestión Pública.",
      publicidad: '',
      especializaciones: especializacionesFiltrados,
      req,
      DateTime,
      convertirPrimeraLetraMayuscula,
      paginaActual,
      cantidadEspecializacionesPagina,
      cantidadPaginas,
      totalEspecializaciones,
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

export const mostrarEspecializacion = async (req, res) => {
  try{
    const slug = req.params.slug
    const [especializaciones, especializacion] = await Promise.all([
      ProgramaAcademico.findAll({
        where: {tipo: "especializacion"},
        order: [["fechaYHora", "ASC"]]
      }), 
      ProgramaAcademico.findOne({
        where: {slug, tipo: 'especializacion'}, 
        order: [["fechaYHora", "ASC"]]
      })
    ])
    if(!especializacion){
        req.flash("error", "La especializacion no existe");
        return res.redirect(ROUTES.HOME)
    }
    const index = especializaciones.findIndex(a => a.id === especializacion.id);
    const indexAnterior = index === 0 ? 0 : index - 1;
    const indexSiguiente = (index === especializaciones.length - 1) ? index : index + 1;

    const isButtonAnterior = index > 0;
    const isButtonSiguiente = index < especializaciones.length - 1

    let contenidoAnterior = isButtonAnterior ? especializaciones.slice(indexAnterior, indexAnterior  + 1)[0] : undefined;
    let contenidoSiguiente = isButtonSiguiente ? especializaciones.slice(indexSiguiente, indexSiguiente  + 1)[0] : undefined;
    

    const extracto = especializacion.descripcion.trim().split(/\s+/).slice(0, 35).join(' ');
    return res.render('programa/mostrar-especializacion', {
        title: `${especializacion.titulo} &#8211; OLADEG`,
        description: extracto,
        publicidad: '',
        especializacion,
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

