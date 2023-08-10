import ProgramaAcademico from "../models/ProgramaAcademicoModel.js";
import * as ROUTES from "../config/routes.js";
import {DateTime} from "luxon";
import { convertirPrimeraLetraMayuscula } from "../helpers/date.js";


export const mostrarCursos = async (req, res) => {
  try{
    const cursos = await ProgramaAcademico.findAll({where: {tipo: 'curso'}, order: [["fechaYHora", "DESC"]]});
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
  try{
    const slug = req.params.slug
    const [cursos, curso] = await Promise.all([
      ProgramaAcademico.findAll({
        where: {tipo: "curso"},
        order: [["fechaYHora", "DESC"]]
      }), 
      ProgramaAcademico.findOne({
        where: {slug, tipo: 'curso'}, 
        order: [["fechaYHora", "DESC"]]
      })
    ])
    if(!curso){
        req.flash("error", "El curso no existe");
        return res.redirect(ROUTES.HOME)
    }
    const index = cursos.findIndex(a => a.id === curso.id);
    const indexAnterior = index === 0 ? 0 : index - 1;
    const indexSiguiente = (index === cursos.length - 1) ? index : index + 1;

    const isButtonAnterior = index > 0;
    const isButtonSiguiente = index < cursos.length - 1

    let contenidoAnterior = isButtonAnterior ? cursos.slice(indexAnterior, indexAnterior  + 1)[0] : undefined;
    let contenidoSiguiente = isButtonSiguiente ? cursos.slice(indexSiguiente, indexSiguiente  + 1)[0] : undefined;
    

    const extracto = curso.descripcion.trim().split(/\s+/).slice(0, 35).join(' ');
    console.log(extracto);
    return res.render('programa/mostrar-curso', {
        title: `${curso.titulo} &#8211; OLADEG`,
        description: extracto,
        publicidad: '',
        curso,
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

