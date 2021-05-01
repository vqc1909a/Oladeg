const {obtenerEspecializaciones} = require("../helpers");

const mostrarEspecializaciones = async (req, res) => {
  let especializaciones = await obtenerEspecializaciones();
  let pagina_actual = req.query.page ? parseInt(req.query.page) : 1;
  let total_elementos = especializaciones.length;
  let elementos_por_pagina = 4;
  let elementos_hasta_ahora = elementos_por_pagina;
  let total_paginas = Math.ceil(total_elementos / elementos_por_pagina)
  if(!isNaN(pagina_actual) & pagina_actual >= 1 & pagina_actual <= total_paginas){
    elementos_hasta_ahora = pagina_actual * elementos_por_pagina;
  }else{
    pagina_actual = 1;
  }
  especializaciones = especializaciones.slice(elementos_hasta_ahora - elementos_por_pagina, elementos_hasta_ahora)
  return res.render('pages/especializacionesView', {
    title: "Especializaciones &#8211; OLADEG",
    description: "Oladeg te invita a participar de las Especializaciones de Capacitación a Distancia Virtual mediante su Escuela de Gestión Pública.",
    protocol: req.protocol, 
    host: req.headers.host,
    especializaciones,
    pagina_actual,
    total_elementos,
    elementos_por_pagina,
    total_paginas,
    publicidad: ''
  })
}

const mostrarEspecializacion = async (req, res) => {
  const url = req.params.especializacion;
  let especializaciones = await obtenerEspecializaciones();
  let especializacion = especializaciones.find((espe) => espe.Url === url);
  let anterior;
  let despues;
  let ubicacion;
  especializaciones.forEach((espe, i) => {
    if(espe.Titulo === especializacion.Titulo){
      ubicacion = i;
    }
  });
  anterior = especializaciones[ubicacion + 1];
  despues = especializaciones[ubicacion - 1];
  return res.render('pages/especializacionView', {
    title: `${especializacion.Titulo} &#8211; OLADEG`,
    description: especializacion.metadescripcion,
    protocol: req.protocol, 
    host: req.headers.host,
    especializacion,
    anterior,
    despues,
    publicidad: ''
  })
}

module.exports = {mostrarEspecializaciones, mostrarEspecializacion};