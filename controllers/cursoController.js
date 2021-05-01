const {obtenerCursos} = require("../helpers");

const mostrarCursos = async (req, res) => {

  let cursos = await obtenerCursos();
  let pagina_actual = req.query.page ? parseInt(req.query.page) : 1;
  let total_elementos = cursos.length;
  let elementos_por_pagina = 4;
  let elementos_hasta_ahora = elementos_por_pagina;
  let total_paginas = Math.ceil(total_elementos / elementos_por_pagina)
  if(!isNaN(pagina_actual) & pagina_actual >= 1 & pagina_actual <= total_paginas){
    elementos_hasta_ahora = pagina_actual * elementos_por_pagina;
  }else{
    pagina_actual = 1;
  }
  cursos = cursos.slice(elementos_hasta_ahora - elementos_por_pagina, elementos_hasta_ahora)

  return res.render('pages/cursosView', {
    title: "Cursos &#8211; OLADEG",
    description: "Oladeg te invita a participar de los Cursos de Capacitación a Distancia Virtual mediante su Escuela de Gestión Pública.",
    protocol: req.protocol, 
    host: req.headers.host,
    cursos,
    pagina_actual,
    total_elementos,
    elementos_por_pagina,
    total_paginas,
    publicidad: ''
  })
}

const mostrarCurso = async (req, res) => {
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
  return res.render('pages/cursoView', {
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

module.exports = {mostrarCursos, mostrarCurso};