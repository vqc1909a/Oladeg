const axios = require("axios");
const showdown = require("showdown");
const { htmlToText } = require("html-to-text");
const converter = new showdown.Converter();
converter.setOption('strikethrough', true);
converter.setOption('openLinksInNewWindow', true);
converter.setOption('emoji', true);

const monthNames = ["Enero", "Febreo", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

exports.obtenerAnuncios = async () => {
  let {data} = await axios.get(process.env.BACKEND_URI + '/anuncios');
  let anuncios = data.map((anuncio) => {
    let fecha = new Date(anuncio.created_at)
    anuncio.Contenido = converter.makeHtml(anuncio.Contenido);
    anuncio.Portada = process.env.BACKEND_URI + anuncio.Portada.url;
    anuncio.month = monthNames[fecha.getMonth()];
    anuncio.date = fecha.getDate();
    anuncio.year = fecha.getFullYear();
    anuncio.metadescripcion = htmlToText(anuncio.Contenido, {
      wordwrap: 130
    }).replaceAll(/\n/g,' ').slice(0, 170);
    return anuncio;
  })
  return anuncios.reverse();
}

exports.obtenerCursos = async () => {
  let {data} = await axios.get(process.env.BACKEND_URI + '/cursos-diplomado-especializaciones');
  let cursos = data.filter(dat => dat.TipoDeContenido === "CURSO");
  cursos = cursos.map(curso => {
    curso.Portada = process.env.BACKEND_URI + curso.Portada.url;
    curso.Certificado = curso.Certificado ? process.env.BACKEND_URI + curso.Certificado.url : '';
    curso.fecha_month = monthNames[new Date(curso.created_at).getMonth()];
    curso.fecha_year = new Date(curso.created_at).getFullYear();
    curso.fecha_date = new Date(curso.created_at).getDate();
    curso.inicio_month = monthNames[new Date(curso.FechaDeInicio).getMonth()];
    curso.inicio_year = new Date(curso.FechaDeInicio).getFullYear();
    curso.inicio_date = new Date(curso.FechaDeInicio).getDate();
    let inicio_hour = new Date(curso.FechaDeInicio).getHours();
    let inicio_horario = "am";
    curso.inicio_hour =inicio_hour;
    curso.inicio_horario = inicio_horario
    if(inicio_hour > 12 ){
      curso.inicio_hour = inicio_hour - 12
      curso.inicio_horario = "pm";
    }
    curso.inicio_minute = new Date(curso.FechaDeInicio).getMinutes();
    curso.ImagenExpositor = curso.ImagenExpositor ? process.env.BACKEND_URI + curso.ImagenExpositor.url : '';
    curso.Descripcion = converter.makeHtml(curso.Descripcion);
    curso.DescripcionExpositor = curso.DescripcionExpositor ? converter.makeHtml(curso.DescripcionExpositor) : '';
    curso.Inscripcion = curso.Inscripcion ? converter.makeHtml(curso.Inscripcion) : '';
    curso.Temario = curso.Temario ? converter.makeHtml(curso.Temario) : '';
    curso.Materiales = curso.Materiales ? converter.makeHtml(curso.Materiales) : '';
    curso.Promocion = curso.Promocion ? converter.makeHtml(curso.Promocion) : '';
    curso.Metodologia = curso.Metodologia ? converter.makeHtml(curso.Metodologia) : '';
    curso.metadescripcion = htmlToText(curso.Descripcion, {
      wordwrap: 130
    }).replaceAll(/\n/g,' ').slice(0, 170);
    return curso;
  })
  return cursos.reverse();
}

exports.obtenerDiplomados = async () => {
  let {data} = await axios.get(process.env.BACKEND_URI + '/cursos-diplomado-especializaciones');
  let diplomados = data.filter(dat => dat.TipoDeContenido === "DIPLOMADO");
  diplomados = diplomados.map(diplo => {
    diplo.Portada = process.env.BACKEND_URI + diplo.Portada.url;
    diplo.Certificado = diplo.Certificado ? process.env.BACKEND_URI + diplo.Certificado.url : '';
    diplo.fecha_month = monthNames[new Date(diplo.created_at).getMonth()];
    diplo.fecha_year = new Date(diplo.created_at).getFullYear();
    diplo.fecha_date = new Date(diplo.created_at).getDate();
    diplo.inicio_month = monthNames[new Date(diplo.FechaDeInicio).getMonth()];
    diplo.inicio_year = new Date(diplo.FechaDeInicio).getFullYear();
    diplo.inicio_date = new Date(diplo.FechaDeInicio).getDate();
    let inicio_hour = new Date(diplo.FechaDeInicio).getHours();
    let inicio_horario = "am";
    diplo.inicio_hour =inicio_hour;
    diplo.inicio_horario = inicio_horario
    if(inicio_hour > 12 ){
      diplo.inicio_hour = inicio_hour - 12
      diplo.inicio_horario = "pm";
    }
    diplo.inicio_minute = new Date(diplo.FechaDeInicio).getMinutes();
    diplo.ImagenExpositor = diplo.ImagenExpositor ? process.env.BACKEND_URI + diplo.ImagenExpositor: ''.url;
    diplo.Descripcion = converter.makeHtml(diplo.Descripcion);
    diplo.DescripcionExpositor = diplo.DescripcionExpositor ? converter.makeHtml(diplo.DescripcionExpositor) : '';
    diplo.Inscripcion = diplo.Inscripcion ? converter.makeHtml(diplo.Inscripcion) : '';
    diplo.Temario = diplo.Temario ? converter.makeHtml(diplo.Temario) : '';
    diplo.Materiales = diplo.Materiales ? converter.makeHtml(diplo.Materiales) : '';
    diplo.Promocion = diplo.Promocion ? converter.makeHtml(diplo.Promocion) : '';
    diplo.Metodologia = diplo.Metodologia ? converter.makeHtml(diplo.Metodologia) : '';
    diplo.metadescripcion = htmlToText(diplo.Descripcion, {
      wordwrap: 130
    }).replaceAll(/\n/g,' ').slice(0, 170);
    return diplo;
  })
  return diplomados.reverse();
}


exports.obtenerEspecializaciones = async () => {
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

exports.obtenerLibros = async () => {
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

exports.obtenerBoletines = async () => {
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

exports.obtenerUltimaPublicidad = async () => {
  let {data} = await axios.get(process.env.BACKEND_URI + '/publicidads');
  let publicidad = data.reverse()[0];
  if(publicidad) publicidad.Imagen = process.env.BACKEND_URI + publicidad.Imagen.url;
  return publicidad;
}