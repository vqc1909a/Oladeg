export const mostrarPaginaPrincipal = async (req, res) => {
  let anuncios = [];
  let publicidad = undefined;

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
  
  return res.render("pages/home", {
    title: "OLADEG &#8211; Desarrollo Rural y Gobiernos Locales",
    description: "Oladeg es una ONG que va dirigido a los ciudadanos, líderes sociales, autoridades y funcionarios de gobiernos locales, regionales y organizacionales.",
    pagina_actual,
    total_elementos,
    elementos_por_pagina,
    total_paginas,
    publicidad
  });
}