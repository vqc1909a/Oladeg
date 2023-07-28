import axios from "axios";
import showdown from "showdown";
import { htmlToText } from "html-to-text";
const converter = new showdown.Converter();
converter.setOption('strikethrough', true);
converter.setOption('openLinksInNewWindow', true);
converter.setOption('emoji', true);

const monthNames = ["Enero", "Febreo", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];






export const obtenerEspecializaciones = async () => {
  let {data} = await axios.get(process.env.BACKEND_URI + '/cursos-diplomado-especializaciones');
  let especializaciones = data.filter(dat => dat.TipoDeContenido === "ESPECIALIZACION");
  especializaciones = especializaciones.map(espe => {
    espe.Portada = process.env.BACKEND_URI + espe.Portada.url;
    espe.Certificado = espe.Certificado ? process.env.BACKEND_URI + espe.Certificado.url : '';
    espe.fecha_month = monthNames[new Date(espe.created_at).getMonth()];
    espe.fecha_year = new Date(espe.created_at).getFullYear();
    espe.fecha_date = new Date(espe.created_at).getDate();
    espe.inicio_month = monthNames[new Date(espe.FechaDeInicio).getMonth()];
    espe.inicio_year = new Date(espe.FechaDeInicio).getFullYear();
    espe.inicio_date = new Date(espe.FechaDeInicio).getDate();
    let inicio_hour = new Date(espe.FechaDeInicio).getHours();
    let inicio_horario = "am";
    espe.inicio_hour =inicio_hour;
    espe.inicio_horario = inicio_horario
    if(inicio_hour > 12 ){
      espe.inicio_hour = inicio_hour - 12
      espe.inicio_horario = "pm";
    }
    espe.inicio_minute = new Date(espe.FechaDeInicio).getMinutes();
    espe.ImagenExpositor = espe.ImagenExpositor ? process.env.BACKEND_URI + espe.ImagenExpositor.url : '';
    espe.Descripcion = converter.makeHtml(espe.Descripcion);
    espe.DescripcionExpositor = espe.DescripcionExpositor ? converter.makeHtml(espe.DescripcionExpositor) : '';
    espe.Inscripcion = espe.Inscripcion ? converter.makeHtml(espe.Inscripcion) : '';
    espe.Temario = espe.Temario ? converter.makeHtml(espe.Temario) : '';
    espe.Materiales = espe.Materiales ? converter.makeHtml(espe.Materiales) : '';
    espe.Promocion = espe.Promocion ? converter.makeHtml(espe.Promocion) : '';
    espe.Metodologia = espe.Metodologia ? converter.makeHtml(espe.Metodologia) : '';
    espe.metadescripcion = htmlToText(espe.Descripcion, {
      wordwrap: 130
    }).replaceAll(/\n/g,' ').slice(0, 170);
    return espe;
  })
  return especializaciones.reverse();
}

export const obtenerLibros = async () => {
  let {data} = await axios.get(process.env.BACKEND_URI + '/biblioteca-digitals');
  let libros = data;
  libros = libros.map(lib => {
    lib.Portada = process.env.BACKEND_URI + lib.Portada.url;
    lib.Libro = lib.Libro ? process.env.BACKEND_URI + lib.Libro.url : '';
    lib.fecha_month = monthNames[new Date(lib.created_at).getMonth()];
    lib.fecha_year = new Date(lib.created_at).getFullYear();
    lib.fecha_date = new Date(lib.created_at).getDate();
    lib.Contenido = converter.makeHtml(lib.Contenido);
    lib.metadescripcion = htmlToText(lib.Contenido, {
      wordwrap: 130 
    }).replaceAll(/\n/g,' ').slice(0, 170); 
    return lib;
  })
  return libros.reverse();
}

export const obtenerBoletines = async () => {
  let {data} = await axios.get(process.env.BACKEND_URI + '/boletines');
  let boletines = data;
  boletines = boletines.map(bol => {
    bol.Portada = process.env.BACKEND_URI + bol.Portada.url;
    bol.Boletin = bol.Boletin ? process.env.BACKEND_URI + bol.Boletin.url : '';
    bol.fecha_month = monthNames[new Date(bol.created_at).getMonth()];
    bol.fecha_year = new Date(bol.created_at).getFullYear();
    bol.fecha_date = new Date(bol.created_at).getDate();
    bol.Contenido = converter.makeHtml(bol.Contenido);
    bol.metadescripcion = htmlToText(bol.Contenido, {
      wordwrap: 130 
    }).replaceAll(/\n/g,' ').slice(0, 170); 
    return bol;
  })
  return boletines.reverse();
}

export const obtenerUltimaPublicidad = async () => {
  let {data} = await axios.get(process.env.BACKEND_URI + '/publicidads');
  let publicidad = data.reverse()[0];
  if(publicidad) publicidad.Imagen = process.env.BACKEND_URI + publicidad.Imagen.url;
  return publicidad;
}