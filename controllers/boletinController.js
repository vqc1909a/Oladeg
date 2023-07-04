const {obtenerBoletines} = require('../helpers');


const mostrarBoletines = async (req, res) => {
  let boletines = await obtenerBoletines();
  let pagina_actual = req.query.page ? parseInt(req.query.page) : 1;
  let total_elementos = boletines.length;
  let elementos_por_pagina = 4;
  let elementos_hasta_ahora = elementos_por_pagina;
  let total_paginas = Math.ceil(total_elementos / elementos_por_pagina)
  if(!isNaN(pagina_actual) & pagina_actual >= 1 & pagina_actual <= total_paginas){
    elementos_hasta_ahora = pagina_actual * elementos_por_pagina;
  }else{
    pagina_actual = 1;
  }
  boletines = boletines.slice(elementos_hasta_ahora - elementos_por_pagina, elementos_hasta_ahora);
  return res.render("pages/boletinesView", {
    title: "Boletines &#8211; OLADEG",
    description: "Ofrecemos información digital legalizada sobre diversos temas que abarca la organización Oladeg.",
    protocol: req.protocol,
    host: req.headers.host,
    boletines,
    pagina_actual,
    total_elementos,
    elementos_por_pagina,
    total_paginas,
    publicidad: ''
  });
}

const mostrarBoletin = async (req, res) => {
  const url = req.params.boletin;
  let boletines = await obtenerBoletines();
  let boletin = boletines.find((bol) => bol.Url === url );
  let anterior;
  let despues;
  let ubicacion
  boletines.forEach((bol, i) => {
    if(bol.Titulo === boletin.Titulo){
      ubicacion = i;
    }
  });
  anterior = boletines[ubicacion + 1];
  despues = boletines[ubicacion - 1];
  return res.render('pages/boletinView', {
    title: `${boletin.Titulo} &#8211; OLADEG`,
    description: boletin.metadescripcion,
    protocol: req.protocol, 
    host: req.headers.host,
    boletin,
    anterior,
    despues,
    publicidad: ''
  })
 
}

module.exports = {mostrarBoletines, mostrarBoletin}