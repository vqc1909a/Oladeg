import ProgramaAcademico from "../models/ProgramaAcademicoModel.js";
import * as ROUTES from "../config/routes.js";
import {DateTime} from "luxon";
import { convertirPrimeraLetraMayuscula } from "../helpers/date.js";


export const mostrarCursos = async (req, res) => {

  try{
    const cursos = await ProgramaAcademico.findAll({order: [["fechaYHora", "ASC"]], tipo: 'curso'});
    const cantidadCursosPagina = 4;
    const totalCursos = cursos.length;
    const cantidadPaginas = Math.ceil(totalCursos / cantidadCursosPagina)
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

    const cursosFiltrados = cursos.slice(cantidadCursosPagina * (paginaActual - 1), cantidadCursosPagina * paginaActual);

    
    return res.render("programa/mostrar-cursos", {
      title: "Cursos &#8211; OLADEG",
      description: "Oladeg te invita a participar de los Cursos de Capacitación en cualquiera de sus modalidades mediante su Escuela de Gestión Pública.",
      publicidad: '',
      cursos: cursosFiltrados,
      req,
      DateTime,
      convertirPrimeraLetraMayuscula,
      paginaActual,
      cantidadCursosPagina,
      cantidadPaginas,
      totalCursos,
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

export const mostrarCurso = async (req, res) => {
  const url = req.params.curso;
  let cursos = await obtenerCursos();
  let curso = cursos.find((anuncio) => anuncio.Url === url);
  let anterior;
  let despues;
  let ubicacion;
  cursos.forEach((cur, i) => {
    if(cur.Titulo === curso.Titulo){
      ubicacion = i;
    }
  });
  anterior = cursos[ubicacion + 1];
  despues = cursos[ubicacion - 1];
  return res.render('programa/mostrar-curso', {
    title: `${curso.Titulo} &#8211; OLADEG`,
    description: curso.metadescripcion,
    protocol: req.protocol, 
    host: req.headers.host,
    curso,
    anterior,
    despues,
    publicidad: ''
  })
}

