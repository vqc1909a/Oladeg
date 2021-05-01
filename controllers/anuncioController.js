
const {obtenerAnuncios, obtenerUltimaPublicidad} = require('../helpers');

const mostrarPaginaPrincipal = async (req, res) => {
  let anuncios = await obtenerAnuncios();
  let publicidad = await obtenerUltimaPublicidad();

  let pagina_actual = req.query.page ? parseInt(req.query.page) : 1;
  let total_elementos = anuncios.length;
  let elementos_por_pagina = 4;
  let elementos_hasta_ahora = elementos_por_pagina;
  let total_paginas = Math.ceil(total_elementos / elementos_por_pagina)
  if(!isNaN(pagina_actual) & pagina_actual >= 1 & pagina_actual <= total_paginas){
    elementos_hasta_ahora = pagina_actual * elementos_por_pagina;
  }else{
    pagina_actual = 1;
  }
  anuncios = anuncios.slice(elementos_hasta_ahora - elementos_por_pagina, elementos_hasta_ahora)
  return res.render("pages/indexView", {
    title: "OLADEG &#8211; Desarrollo Rural y Gobiernos Locales",
    description: "Oladeg es una ONG que va dirigido a los ciudadanos, líderes sociales, autoridades y funcionarios de gobiernos locales, regionales y organizacionales.",
    protocol: req.protocol,
    host: req.headers.host,
    anuncios,
    pagina_actual,
    total_elementos,
    elementos_por_pagina,
    total_paginas,
    publicidad
  });
}

const mostrarAnuncio = async (req, res) => {
  const url = req.params.anuncio;
  let anuncios = await obtenerAnuncios();
  let anuncio = anuncios.find((anuncio) => anuncio.Url === url );
  let anterior;
  let despues;
  let ubicacion
  anuncios.forEach((anu, i) => {
    if(anu.Titulo === anuncio.Titulo){
      ubicacion = i;
    }
  });
  anterior = anuncios[ubicacion + 1];
  despues = anuncios[ubicacion - 1];
  return res.render('pages/anuncioView', {
    title: `${anuncio.Titulo} &#8211; OLADEG`,
    description: anuncio.metadescripcion,
    protocol: req.protocol, 
    host: req.headers.host,
    anuncio,
    anterior,
    despues,
    publicidad: ''
  })
}

module.exports = {mostrarPaginaPrincipal, mostrarAnuncio}