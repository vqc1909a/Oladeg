const {obtenerLibros} = require('../helpers');


const mostrarLibros = async (req, res) => {
  let libros = await obtenerLibros();
  let pagina_actual = req.query.page ? parseInt(req.query.page) : 1;
  let total_elementos = libros.length;
  let elementos_por_pagina = 4;
  let elementos_hasta_ahora = elementos_por_pagina;
  let total_paginas = Math.ceil(total_elementos / elementos_por_pagina)
  if(!isNaN(pagina_actual) & pagina_actual >= 1 & pagina_actual <= total_paginas){
    elementos_hasta_ahora = pagina_actual * elementos_por_pagina;
  }else{
    pagina_actual = 1;
  }
  libros = libros.slice(elementos_hasta_ahora - elementos_por_pagina, elementos_hasta_ahora);
  return res.render("pages/librosView", {
    title: "Biblioteca Digital &#8211; OLADEG",
    description: "Ofrecemos documentos, libros y artículos digitales relacionados a temas de Gestión Pública y Empresarial, Planificación, Monitoreo y Evaluación de Proyectos de Desarrollo Económico Rural.",
    protocol: req.protocol,
    host: req.headers.host,
    libros,
    pagina_actual,
    total_elementos,
    elementos_por_pagina,
    total_paginas,
    publicidad: ''
  });
}

const mostrarLibro = async (req, res) => {
  const url = req.params.libro;
  let libros = await obtenerLibros();
  let libro = libros.find((lib) => lib.Url === url );
  let anterior;
  let despues;
  let ubicacion
  libros.forEach((lib, i) => {
    if(lib.Titulo === libro.Titulo){
      ubicacion = i;
    }
  });
  anterior = libros[ubicacion + 1];
  despues = libros[ubicacion - 1];
  return res.render('pages/libroView', {
    title: `${libro.Titulo} &#8211; OLADEG`,
    description: libro.metadescripcion,
    protocol: req.protocol, 
    host: req.headers.host,
    libro,
    anterior,
    despues,
    publicidad: ''
  })
 
}

module.exports = {mostrarLibros, mostrarLibro}