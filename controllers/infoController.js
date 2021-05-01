
const mostrarPaginaConsultorias = (req, res) => {
  return res.render("pages/consultoriasView", {
    title: "Consultorias &#8211; OLADEG",
    description: "Desarrollamos servicios de consultoría especializada en temas de gestión, planificación, monitoreo, evaluación y sistematización de experiencias de programas y proyectos sociales.",
    protocol: req.protocol,
    host: req.headers.host,
    publicidad: ''
  });
}
const mostrarPaginaQuienesSomos = (req, res) => {
  return res.render("pages/quienesSomosView", {
    title: "Quiénes Somos &#8211; OLADEG",
    description: "Es una ONG que promueve, motiva, sensibiliza y logra el desarrollo integral y sostenible de los pueblos latinoamericanos a través de sus cursos y programas de capacitación.",
    protocol: req.protocol,
    host: req.headers.host,
    publicidad: ''
  });
}

const mostrarPaginaNuestraExperiencia = (req, res) => {
  return res.render("pages/nuestraExperienciaView", {
    title: "Nuestra Experiencia &#8211; OLADEG",
    description: "Experiencia en proveer asistencia técnica y de asesoría a los ciudadanos, autoridades, y representantes de gobiernos locales para promover el desarrollo económico rural.",
    protocol: req.protocol, 
    host: req.headers.host,
    publicidad: ''
  });
}

const mostrarPaginaNuestrosServicios = (req, res) => {
  return res.render("pages/nuestrosServiciosView", {
    title: "Nuestros Servicios &#8211; OLADEG",
    description: "Ofrecemos servicios de capacitación, asistencia técnica, desarrollo económico rural y apoyo integral del funcionamiento de las empresas comunales y cooperativas.",
    protocol: req.protocol, 
    host: req.headers.host,
    publicidad: ''
  });
}
const mostrarPaginaFormasDePago = (req, res) => {
  return res.render("pages/formasDePagoView", {
    title: "Formas de Pago &#8211; OLADEG",
    description: "Usted puede hacer sus pagos en las siguientes Cuentas Bancarias: Banco BBVA, Banco de Crédito BCP y Banco de la Nación a nombre de OLADEG-Perú.",
    protocol: req.protocol, 
    host: req.headers.host,
    publicidad: ''
  });
}
const mostrarPaginaContacto = (req, res) => {
  return res.render("pages/contactoView", {
    title: "Contacto &#8211; OLADEG",
    description: "Contáctanos, Jr Apurimac N° 463 Oficina 402 'F' Lima 1",
    protocol: req.protocol, 
    host: req.headers.host,
    send_info: false,
    publicidad: ''
  });
}


module.exports = {mostrarPaginaConsultorias, mostrarPaginaQuienesSomos, mostrarPaginaNuestraExperiencia, mostrarPaginaNuestrosServicios, mostrarPaginaFormasDePago, mostrarPaginaContacto}