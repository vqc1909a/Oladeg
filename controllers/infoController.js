
export const mostrarPaginaConsultorias = (req, res) => {
  return res.render("pages/consultorias", {
    title: "Consultorias &#8211; OLADEG",
    description: "Desarrollamos servicios de consultoría especializada en temas de gestión, planificación, monitoreo, evaluación y sistematización de experiencias de programas y proyectos sociales.",
    publicidad: ''
  });
}
export const mostrarPaginaQuienesSomos = (req, res) => {
  return res.render("pages/quienesSomos", {
    title: "Quiénes Somos &#8211; OLADEG",
    description: "Es una ONG que promueve, motiva, sensibiliza y logra el desarrollo integral y sostenible de los pueblos latinoamericanos a través de sus cursos y programas de capacitación.",
    publicidad: ''
  });
}

export const mostrarPaginaNuestraExperiencia = (req, res) => {
  return res.render("pages/nuestraExperiencia", {
    title: "Nuestra Experiencia &#8211; OLADEG",
    description: "Experiencia en proveer asistencia técnica y de asesoría a los ciudadanos, autoridades, y representantes de gobiernos locales para promover el desarrollo económico rural.",
    publicidad: ''
  });
}

export const mostrarPaginaNuestrosServicios = (req, res) => {
  return res.render("pages/nuestrosServicios", {
    title: "Nuestros Servicios &#8211; OLADEG",
    description: "Ofrecemos servicios de capacitación, asistencia técnica, desarrollo económico rural y apoyo integral del funcionamiento de las empresas comunales y cooperativas.",
    publicidad: ''
  });
}
export const mostrarPaginaFormasDePago = (req, res) => {
  return res.render("pages/formasDePago", {
    title: "Formas de Pago &#8211; OLADEG",
    description: "Usted puede hacer sus pagos en las siguientes Cuentas Bancarias: Banco BBVA, Banco de Crédito BCP y Banco de la Nación a nombre de OLADEG-Perú.",
    protocol: req.protocol, 
    host: req.headers.host,
    publicidad: ''
  });
}
export const mostrarPaginaContacto = (req, res) => {
  return res.render("pages/contactoView", {
    title: "Contacto &#8211; OLADEG",
    description: "Contáctanos, Jr Apurimac N° 463 Oficina 402 'F' Lima 1",
    protocol: req.protocol, 
    host: req.headers.host,
    send_info: false,
    publicidad: ''
  });
}


