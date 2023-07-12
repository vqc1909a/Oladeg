//HOME ROUTES
export const HOME = "/";

//AUTH ROUTES
export const LOGIN = "/auth/login";
export const REGISTER = "/auth/register";
export const CONFIRM_ACCOUNT = "/auth/confirm/:token";
export const LOGOUT = "/auth/logout";
export const FORGOT_PASSWORD = "/auth/forgot-password";
export const RECOVER_PASSWORD = "/auth/recover-password/:token";

//INFO ROUTES
export const MOSTRAR_CONSULTORIAS = "/consultorias";
export const MOSTRAR_QUIENES_SOMOS = "/quienes-somos";
export const MOSTRAR_NUESTRA_EXPERIENCIA = "/nuestra-experiencia";
export const MOSTRAR_NUESTROS_SERVICIOS = "/nuestros-servicios";
export const MOSTRAR_FORMAS_DE_PAGO = "/formas-de-pago";
export const MOSTRAR_CONTACTO = "/contacto";

//ADMIN ROUTES
export const ADMIN = "/admin";
export const USERS_ADMIN = "/admin/users";
export const ANUNCIOS_ADMIN = "/admin/anuncios";
export const PROGRAMAS_ADMIN = "/admin/programas";


//ANUNCIO ROUTES
export const MOSTRAR_ANUNCIO = "/anuncios/:slug";
export const AGREGAR_ANUNCIO = "/admin/anuncio";
export const EDITAR_ANUNCIO = "/admin/anuncio/:id/edit";
export const EDITAR_IMAGEN_ANUNCIO = "/admin/anuncio/:id/edit-image";
export const ELIMINAR_ANUNCIO = "/admin/anuncio/:id/delete";

//PROGRAMAS ROUTES
export const MOSTRAR_CURSOS = "/cursos";
export const MOSTRAR_CURSO = "/cursos/:slug";
export const MOSTRAR_DIPLOMADOS = "/diplomados";
export const MOSTRAR_DIPLOMADO = "/diplomados/:slug";
export const MOSTRAR_ESPECIALIZACIONES = "/especializaciones";
export const MOSTRAR_ESPECIALIZACION = "/especializaciones/:slug";

export const AGREGAR_PROGRAMA = "/admin/programa";
export const EDITAR_PROGRAMA = "/admin/programa/:id/edit";
export const EDITAR_IMAGEN_PROGRAMA = "/admin/programa/:id/edit-image";
export const ELIMINAR_PROGRAMA = "/admin/programa/:id/delete";





export const PERFIL = "/admin/profile";
export const CHANGE_PASSWORD_PERFIL = "/admin/profile/edit-password";
export const CHANGE_IMAGEN_PERFIL = "/admin/profile/edit-image";
export const CONFIRM_NEW_EMAIL = "/admin/profile/confirm-email/:token";











