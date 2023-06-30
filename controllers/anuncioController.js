
const {obtenerAnuncios, obtenerUltimaPublicidad} = require('../helpers');

export const mostrarAnuncio = async (req, res) => {
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

