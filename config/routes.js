//HOME ROUTES
export const MOSTRAR_HOME = "/";

//AUTH ROUTES
export const CREAR_CUENTA = "/account/register";
export const INICIAR_SESION = "/account/login";
export const CONFIRMAR_CUENTA = "/account/confirm/:token";
export const CERRAR_SESION = "/account/logout";

//INFO ROUTES
export const MOSTRAR_CONSULTORIAS = "/consultorias";
export const MOSTRAR_QUIENES_SOMOS = "/quienes-somos";
export const MOSTRAR_NUESTRA_EXPERIENCIA = "/nuestra-experiencia";
export const MOSTRAR_NUESTROS_SERVICIOS = "/nuestros-servicios";
export const MOSTRAR_FORMAS_DE_PAGO = "/formas-de-pago";
export const MOSTRAR_CONTACTO = "/contacto";



//ADMIN ROUTES
export const ADMIN = "/admin";

export const NUEVO_GRUPO = "/admin/group";
export const EDITAR_GRUPO = "/admin/group/:id/edit";
export const EDITAR_IMAGEN_GRUPO = "/admin/group/:id/edit-image";
export const ELIMINAR_GRUPO = "/admin/group/:id/delete";

export const NUEVO_MEETI = "/admin/meeti";
export const ASISTENTES_MEETI = "/admin/meeti/:id/assistants";
export const EDITAR_MEETI = "/admin/meeti/:id/edit";
export const ELIMINAR_MEETI = "/admin/meeti/:id/delete";

export const PERFIL = "/admin/profile";
export const EDITAR_PASSWORD_PERFIL = "/admin/profile/edit-password";
export const EDITAR_IMAGEN_PERFIL = "/admin/profile/edit-image";
export const CONFIRMAR_NUEVO_CORREO = "/admin/profile/confirm/:token";

//ANUNCIO ROUTES
export const MOSTRAR_ANUNCIO = "/anuncios/:anuncio";

//GROUP ROUTES
export const MOSTRAR_GRUPO = "/groups/:slug";

//MEETI ROUTES
export const MOSTRAR_MEETI = "/meetis/:slug";
export const MOSTRAR_ASISTENTES_MEETI = "/meetis/:slug/asistentes"
export const MOSTRAR_MEETIS_CATEGORIA = "/categorias/:slug/meetis";
//->RUTA PROTEGIDA
export const ASISTIR_MEETI = "/meeti/:slug/asistir";
export const COMENTAR_MEETI = "/meeti/:slug/comentar";
export const ELIMINAR_COMENTARIO_MEETI = "/meeti/:idMeeti/comentario/:idComentario";

//USER ROUTES
export const MOSTRAR_USUARIO = "/users/:slug"

//BUSQUEDA ROUTES
export const BUSQUEDA = "/busqueda";









