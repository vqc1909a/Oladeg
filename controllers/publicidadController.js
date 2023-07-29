export const mostrarPaginaPublicidad = (req, res) => {
 return res.render("pages/publicidad", {
   title: "Nuestros Servicios &#8211; OLADEG",
   description: "Oladeg brinda servicios de publicidad a través de sus 5 canales de comunicación (Emailing, Página Web, Facebook, Twitter y Linkedin)",
   protocol: req.protocol, 
   host: req.headers.host,
   publicidad: ''
 })
}
