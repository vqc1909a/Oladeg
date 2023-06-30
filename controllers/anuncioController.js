
import {obtenerAnuncios, obtenerUltimaPublicidad} from "../helpers.js";

export const mostrarAnuncio = async (req, res) => {
  // const url = req.params.anuncio;
  // let anuncios = await obtenerAnuncios();
  // let anuncio = anuncios.find((anuncio) => anuncio.Url === url );
  // let anterior;
  // let despues;
  // let ubicacion
  // anuncios.forEach((anu, i) => {
  //   if(anu.Titulo === anuncio.Titulo){
  //     ubicacion = i;
  //   }
  // });
  // anterior = anuncios[ubicacion + 1];
  // despues = anuncios[ubicacion - 1];

  return res.render('pages/anuncio', {
    // title: `${anuncio.Titulo} &#8211; OLADEG`,
    title: `I Primer Encuentro de Sostenibilidad en las Empresas Comunales &#8211; OLADEG`,
    // description: anuncio.metadescripcion,
    description: "",
    publicidad: ''
  })
}

