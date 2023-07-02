import * as ROUTES from "../config/routes.js";

//Revisar si el usuario esta autenticado para ingresar a la pagina
export const verificarUsuarioAutenticado = (req, res, next) => {

    //Passport te crea este metodo para verificar si el usuario esta logueado
    if(req.isAuthenticated()){
        return next();
    }
    //Para redirigirme antes a la ruta protegida luego de iniciar sesión
    req.session.redirectTo = req.originalUrl;

    //No esta autenticado
    // req.flash("error", "Sesión Terminada");
    return res.redirect(ROUTES.LOGIN);
}

export const verificarUsuarioNoAutenticado = (req, res, next) => {
    //Passport te crea este metodo para verificar si el usuario esta logueado
    if(!req.isAuthenticated()){
        return next();
    }

    //Esta autenticado
    return res.redirect(ROUTES.ADMIN);
}
