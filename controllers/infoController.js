const mostrarPaginaPrincipal = (req, res) => {
  return res.render("pages/indexView", {
    title: "OLADEG &#8211; Desarrollo Rural y Gobiernos Locales",
    description: "Oladeg es una ONG que va dirigido a los ciudadanos, líderes sociales, autoridades y funcionarios de gobiernos locales, regionales y organizacionales de la sociedad civil, a través de cursos, seminarios, talleres y pasantías a nivel Nacional e Internacional",
    protocol: req.protocol,
    host: req.headers.host
  });
}
const mostrarPaginaConsultorias = (req, res) => {
  return res.render("pages/consultoriasView", {
    title: "Consultorias &#8211; OLADEG",
    description: "Desarrollamos servicios de consultoría especializada en temas de gestión, planificación, monitoreo, evaluación y sistematización de experiencias de programas y proyectos sociales",
    protocol: req.protocol,
    host: req.headers.host
  });
}
const mostrarPaginaQuienesSomos = (req, res) => {
  return res.render("pages/quienesSomosView", {
    title: "Quiénes Somos &#8211; OLADEG",
    description: "Es una Organización sin Fines de Lucro, una ONG, Promoviendo, motivando, sensibilizando y logrando el desarrollo integral y sostenible, de los pueblos latinoamericanos",
    protocol: req.protocol,
    host: req.headers.host
  });
}
const mostrarPaginaNuestraExperiencia = (req, res) => {
  return res.render("pages/nuestraExperienciaView", {
    title: "Nuestra Experiencia &#8211; OLADEG",
    description: "Experiencia en proveer de asistencia técnica y de asesoría a los ciudadanos, autoridades, y representantes de los gobiernos locales.",
    protocol: req.protocol, 
    host: req.headers.host
  });
}
const mostrarPaginaNuestrosServicios = (req, res) => {
  return res.render("pages/nuestrosServiciosView", {
    title: "Nuestros Servicios &#8211; OLADEG",
    description: "Dirigido a los ciudadanos, líderes sociales, autoridades y funcionarios de gobiernos locales y regionales y organizaciones de la sociedad civil.",
    protocol: req.protocol, 
    host: req.headers.host
  });
}
const mostrarPaginaFormasDePago = (req, res) => {
  return res.render("pages/formasDePagoView", {
    title: "Formas de Pago &#8211; OLADEG",
    description: "Usted puede hacer sus pagos en las siguientes Cuentas Bancarias: Banco BBVA, Banco de Crédito BCP, Banco de la Nación",
    protocol: req.protocol, 
    host: req.headers.host
  });
}
const mostrarPaginaContacto = (req, res) => {
  return res.render("pages/contactoView", {
    title: "Contacto &#8211; OLADEG",
    description: "Contáctanos, Jr Apurimac N° 463 Oficina 402 'F' Lima 1, +51931216468 | +51940379357",
    protocol: req.protocol, 
    host: req.headers.host,
    send_info: false
  });
}
const mostrarPaginaCursos = (req, res) => {
  return res.render('pages/cursosView', {
    title: "Cursos &#8211; OLADEG",
    description: "Organización Latinoamericano para el Desarrollo Rural y Apoyo a los Gobiernos Locales, invita a participar a los Diplomados y Cursos de Capacitación a Distancia Virtual mediante su Escuela de Gestión Pública.",
    protocol: req.protocol, 
    host: req.headers.host,
  })
}
const mostrarPaginaDiplomados = (req, res) => {
  return res.render('pages/diplomadosView', {
    title: "Diplomados &#8211; OLADEG",
    description: "Organización Latinoamericano para el Desarrollo Rural y Apoyo a los Gobiernos Locales, invita a participar a los Diplomados y Cursos de Capacitación a Distancia Virtual mediante su Escuela de Gestión Pública.",
    protocol: req.protocol, 
    host: req.headers.host,
  })
}
const mostrarPaginaEspecializaciones = (req, res) => {
  return res.render('pages/especializacionesView', {
    title: "Especializaciones &#8211; OLADEG",
    description: "Organización Latinoamericano para el Desarrollo Rural y Apoyo a los Gobiernos Locales, invita a participar a los Diplomados y Cursos de Capacitación a Distancia Virtual mediante su Escuela de Gestión Pública.",
    protocol: req.protocol, 
    host: req.headers.host,
  })
}



module.exports = {mostrarPaginaPrincipal, mostrarPaginaConsultorias, mostrarPaginaQuienesSomos, mostrarPaginaNuestraExperiencia, mostrarPaginaNuestrosServicios, mostrarPaginaFormasDePago, mostrarPaginaContacto, mostrarPaginaCursos, mostrarPaginaDiplomados, mostrarPaginaEspecializaciones}