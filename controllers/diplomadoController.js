const {obtenerDiplomados} = require("../helpers");

const mostrarDiplomados = async (req, res) => {
  let diplomados = await obtenerDiplomados();
  let pagina_actual = req.query.page ? parseInt(req.query.page) : 1;
  let total_elementos = diplomados.length;
  let elementos_por_pagina = 4;
  let elementos_hasta_ahora = elementos_por_pagina;
  let total_paginas = Math.ceil(total_elementos / elementos_por_pagina)
  if(!isNaN(pagina_actual) & pagina_actual >= 1 & pagina_actual <= total_paginas){
    elementos_hasta_ahora = pagina_actual * elementos_por_pagina;
  }else{
    pagina_actual = 1;
  }
  diplomados = diplomados.slice(elementos_hasta_ahora - elementos_por_pagina, elementos_hasta_ahora)
  return res.render('pages/diplomadosView', {
    title: "Diplomados &#8211; OLADEG",
    description: "Oladeg invita a participar a los Diplomados, Cursos y Especializaciones de Capacitación a Distancia Virtual mediante su Escuela de Gestión Pública.",
    protocol: req.protocol, 
    host: req.headers.host,
    diplomados,
    pagina_actual,
    total_elementos,
    elementos_por_pagina,
    total_paginas,
    publicidad: ''
  })
}

const mostrarDiplomado = async (req, res) => {
  const url = req.params.diplomado;
  let diplomados = await obtenerDiplomados();
  let diplomado = diplomados.find((diplo) => diplo.Url === url);
  let anterior;
  let despues;
  let ubicacion;
  diplomados.forEach((diplo, i) => {
    if(diplo.Titulo === diplomado.Titulo){
      ubicacion = i;
    }
  });
  anterior = diplomados[ubicacion + 1];
  despues = diplomados[ubicacion - 1];
  return res.render('pages/diplomadoView', {
    title: `${diplomado.Titulo} &#8211; OLADEG`,
    description: diplomado.metadescripcion,
    protocol: req.protocol, 
    host: req.headers.host,
    diplomado,
    anterior,
    despues,
    publicidad: ''
  })
}

module.exports = {mostrarDiplomados, mostrarDiplomado};