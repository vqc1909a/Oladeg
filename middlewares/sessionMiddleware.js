import {v4 as uuidv4} from "uuid";
import * as ROUTES from "../config/routes.js";

export const establecerVariablesGlobales = (req, res, next) => {
    
    const fecha = new Date();
    //Añadir variables globales que solo se usan en los templates nada más en los templates funciona, en ningun lugar más
    res.locals.year = fecha.getFullYear();
    res.locals.ROUTES = ROUTES;
    res.locals.isAuthenticated = req.user ? true : false;
    res.locals.idUserAuthenticated = req.user ? req.user.id : undefined;
    //Cada vez que llamamos al flash, se almacenara el valor en los locals y podremos usarlo en cualquier pagina
    const flashes = req.flash();
    res.locals.mensajes = {
        "error": flashes["error"],
        "success": flashes["success"]
    };        
    res.locals.fields = flashes["fields"] && flashes["fields"][0];
    
    next();
}

export const establecerProteccionCSRF = (req, res, next) => {
    //Añadir Protección CSRF
    if(!req.session.csrfToken){
        req.session.csrfToken = uuidv4();
    }

    //Asignamos el token a la cookie para hacerlo mucho mas seguro, con la anterior cookie "connect.sid" y con esta cookie hacemos que si o si el usuario tiene que ingresar a un endpoint get para asignar los tokens, caso contrario nos votara el error 403
    res.cookie('XSRF-TOKEN', req.session.csrfToken, {
        httpOnly: true, // Permite que el cliente pueda leer la cookie solo desde el servidor para incluir el token CSRF en las solicitudes y no desde el navegador (javascript), o sea leer su contenido de la cookie solo desde el servidor y no desde el navegador. Esto ayuda a prevenir ataques de robo de cookies mediante scripts maliciosos.
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: 'strict', // Solo envía la cookie a través de solicitudes del mismo sitio
        maxAge: 1000 * 60 * 60
    })

    //Asignamos la variable en locals para usarlo donde queramos
    res.locals.csrfToken = req.session.csrfToken;
    
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const xsrfToken = req.cookies['XSRF-TOKEN'];
        const csrfToken = req.body._csrf || req.query._csrf || req.headers['x-csrf-token'];
        if (!csrfToken || csrfToken !== req.session.csrfToken || !xsrfToken || xsrfToken !== req.session.csrfToken) {
            req.flash("error", "Token CSRF no válido o Sesión Terminada");
            return res.redirect(ROUTES.LOGIN);
            // return res.status(403).send('Token CSRF no válido');
        }
    }
    //Cuando hacemos petición a un get y se termino la sesión y volvemos a recargar la pagina, comos e termino la sesión, nos redirigira a la pagina para iniciar sesión nuevamente, esto por los middlewares, en caso sea un petición donde este involucrado un formulario con csrf token, pues no va a redirigir a la anterior validación, o sea a ROUTES.INICIAR_SESIÓN
    next();
}