import User from "../models/UserModel.js";
import { body, validationResult} from "express-validator";
import { enviarEmailConfirmacion, enviarEmailRecuperación } from "../helpers/email.js";
import { establecerTokenPassword } from "../helpers/user.js";
import { v4 as uuidv4 } from 'uuid';
import passport from "passport";
import * as ROUTES from "../config/routes.js";

export const formCrearCuenta = (req, res) =>{
    res.render("crear-cuenta", {
        nombrePagina: "Crea tu cuenta",
    })
}

export const crearNuevaCuenta = async (req, res) => {
    try{
        
        //Comprobar si el usuario ya existe
        const userSearched = await User.findOne({where: { email: req.body.email}});
        if(userSearched){
            req.flash('error', "El usuario ya se encuentra registrado");
            req.flash('fields', { nombre: req.body.nombre, email: req.body.email })
            return res.redirect(ROUTES.CREAR_CUENTA);
        }

        const user = await User.build(req.body);
        await user.validate();
        //AQUI PONGO ESTA VALIDACIÓN PORQUE ESTOY HACIENDO USO DEL REQ.BODY, CASO CONTRARIO LO HUBIERA PUESTO EN EL VALIDATION
        await body('repetir_password').trim().escape().notEmpty().withMessage("La confirmación de password es obligatoria").equals(req.body.password).withMessage("La confirmacion de password es incorrecta").run(req);

        let errorsExpress = validationResult(req);
        //Comprobamos si hay errores de express
        if(!errorsExpress.isEmpty()){
            const erroresExpress = errorsExpress.array().map(err => err.msg)
            req.flash('error', erroresExpress);
            req.flash('fields', { nombre: req.body.nombre, email: req.body.email })
            return res.redirect(ROUTES.CREAR_CUENTA);
        }
        const userSaved = await user.save();
        //Enviar email de confirmación
        const email = userSaved.email;
        const nombre = userSaved.nombre;
        const token = uuidv4();
        await enviarEmailConfirmacion(nombre, email, token, req);
        //Establecemos una hora para la expiración del token
        await establecerTokenPassword(userSaved, token);
        req.flash('success', 'Hemos enviado un E-mail, confirma tu cuenta');
        return res.redirect(ROUTES.INICIAR_SESION);
    }catch(err){
        let erroresSequelize = []
        //Vamos a obtener los errores del propio modelo si no cumple laredirects restricciones que le pusimos para cada campo
        if(err.errors){
            erroresSequelize = err.errors.map(err => err.message);
        }else{
            erroresSequelize.push(err.message);
        }
        req.flash('error', erroresSequelize);
        req.flash('fields', { nombre: req.body.nombre, email: req.body.email })
        return res.redirect(ROUTES.CREAR_CUENTA);
    }
}

export const mostrarPaginaInicioSesion = async (req, res) => {
    try{
        return res.render("admin/iniciar-sesion", {
            nombrePagina: "Iniciar Sesión",
        })
    }catch(err){
        req.flash("error", err.message);
        return res.redirect(ROUTES.PAGINA_HOME);
    }
}

export const iniciarSesion = async (req, res, next) => {
    try{
        passport.authenticate('local', (err, user, info) => {
            //Success
            // {
            //    err: null,
            //    user: User {
            //      dataValues: {
            //        id: 1,
            //        nombre: 'vqc1909a',
            //        slug: 'vqc1909a-dAQKpZKMa',
            //        imagen: '/dist/uploads/profiles/no-profile-img-VPc44xOhq.jpg',
            //        descripcion: '<h1 class="ql-align-center"><u>VQC1909A</u></h1><p>Hola soy Cesar</p>',
            //        email: 'vqc1909a@gmail.com',
            //        password: '$2a$10$7H8qvDeVA9j2H4jFdK50D.7F0FHzKDHEZEgR8x2anivYESY04q76i',
            //        activo: 1,
            //        tokenPassword: null,
            //        expiraToken: null,
            //        createdAt: 2023-06-13T18:20:09.190Z,
            //        updatedAt: 2023-06-21T05:14:55.920Z
            //      },
            //      _previousDataValues: {
            //        id: 1,
            //        nombre: 'vqc1909a',
            //        slug: 'vqc1909a-dAQKpZKMa',
            //        imagen: '/dist/uploads/profiles/no-profile-img-VPc44xOhq.jpg',
            //        descripcion: '<h1 class="ql-align-center"><u>VQC1909A</u></h1><p>Hola soy Cesar</p>',
            //        email: 'vqc1909a@gmail.com',
            //        password: '$2a$10$7H8qvDeVA9j2H4jFdK50D.7F0FHzKDHEZEgR8x2anivYESY04q76i',
            //        activo: 1,
            //        tokenPassword: null,
            //        expiraToken: null,
            //        createdAt: 2023-06-13T18:20:09.190Z,
            //        updatedAt: 2023-06-21T05:14:55.920Z
            //      },
            //      uniqno: 1,
            //      _changed: Set(0) {},
            //      _options: {
            //        isNewRecord: false,
            //        _schema: null,
            //        _schemaDelimiter: '',
            //        raw: true,
            //        attributes: [Array]
            //      },
            //      isNewRecord: false
            //    },
            //    info: undefined
            // }

            //Error
            // {
            //   err: null,
            //   user: false,
            //   info: { message: 'Email y/o contraseña inválidos' }
            // }

            if(!user){
                req.flash("error", info.message === "Missing credentials" ? "Ambos campos son obligatorios" : info.message);
                return res.redirect(ROUTES.INICIAR_SESION)
            };

            const redirecTo = req.session.redirectTo || ROUTES.ADMIN;
            console.log({
                redirecTo
            })
            delete req.session.redirectTo;
            //Antes de todo esto, basicamente me ejecuta todo lo que esta en la configuración de passport, solo que apartir de aqui me crea dicha propiedad "passport" en la sesion y su valor es producto de la serialización y me asigna un valor en la propiedad req.user, a esto se llama deserialización y su contenido depende de ello.

            //Metodo propio de passport
            req.login(user, err => {
                if(err) {
                    req.flash("error", err.toString());1
                    return res.redirect(ROUTES.INICIAR_SESION)
                }

                return res.redirect(redirecTo);
            });
        })(req, res, next);
    }catch(err){
        req.flash("error", err.message)
        return res.redirect(ROUTES.INICIAR_SESION);
    }
}

export const confirmarCuenta = async (req, res) => {
    try{
        const token = req.params.token;

        //Verificar si el token es válido
        const user = await User.findOne({where: {tokenPassword: token}})
        
        if(!user){
            req.flash('error', 'Hubo un error al confirmar su cuenta. Inténtelo de nuevo')
            return res.redirect(ROUTES.INICIAR_SESION);
        }
        if(user.activo === 1){
            req.flash('error', 'Tu cuenta ya ha sido confirmada')
            return res.redirect(ROUTES.INICIAR_SESION);
        }
        if(user.expiraToken.getTime() < new Date().getTime()){
            req.flash('error', 'Lo sentimos, el enlace de confirmación ha caducado. Puede generar un nuevo vínculo de restablecimiento desde la página de inicio de sesión.')
            return res.redirect(ROUTES.INICIAR_SESION);
        }
        //Confirmar la cuenta
        user.tokenPassword = null;
        user.expiraToken = null;
        user.activo = 1;
        await user.save();

        req.flash('success', 'Cuenta confirmada exitosamente');
        return res.redirect(ROUTES.INICIAR_SESION);
    }catch(err){
        req.flash('error', err.message);
        return res.redirect(ROUTES.INICIAR_SESION);
    }
}

export const cerrarSesion = async (req, res) => {
    //Metodo propio de passport
    return req.logout(function(err) {
        if (err) { 
            req.flash('error', err.toString());
            return res.redirect(ROUTES.PAGINA_HOME);
        }
        // req.flash('success', 'Cerraste Sesión Correctamente');
        return res.redirect(ROUTES.PAGINA_HOME);
    });
}

