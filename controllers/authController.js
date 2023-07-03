import User from "../models/UserModel.js";
import { body, validationResult} from "express-validator";
import { enviarEmailConfirmacionCuenta, enviarEmailRecuperarPassword } from "../helpers/email.js";
import { establecerTokenPassword } from "../helpers/user.js";
import { v4 as uuidv4 } from 'uuid';
import passport from "passport";
import * as ROUTES from "../config/routes.js";

export const formCrearCuenta = async (req, res) =>{
    try{
        return res.render("crear-cuenta", {
            nombrePagina: "Crea tu cuenta",
        })
    }catch(err){
        req.flash('error', err.message);
        return res.redirect(ROUTES.ADMIN);
    }
}

export const crearNuevaCuenta = async (req, res) => {
    try{
        
        //Comprobar si el usuario ya existe
        const userSearched = await User.findOne({where: { email: req.body.email}});
        if(userSearched){
            req.flash('error', "El usuario ya se encuentra registrado");
            req.flash('fields', { nombre: req.body.nombre, email: req.body.email })
            return res.redirect(ROUTES.REGISTER);
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
            return res.redirect(ROUTES.REGISTER);
        }
        const userSaved = await user.save();
        //Enviar email de confirmación
        const email = userSaved.email;
        const nombre = userSaved.nombre;
        const token = uuidv4();
        await enviarEmailConfirmacionCuenta(nombre, email, token, req);
        //Establecemos una hora para la expiración del token
        await establecerTokenPassword(userSaved, token);
        req.flash('success', 'Hemos enviado un E-mail, confirma tu cuenta');
        return res.redirect(ROUTES.LOGIN);
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
        return res.redirect(ROUTES.REGISTER);
    }
}

export const mostrarPaginaIniciarSesion = async (req, res) => {
    const idAuthenticatedUser = req.cookies.idAuthenticatedUser;
    const user = await User.findByPk(idAuthenticatedUser)
    try{
        return res.render("auth/login", {
            nombrePagina: "Iniciar Sesión",
            cookie: user
        })
    }catch(err){
        req.flash("error", err.message);
        return res.redirect(ROUTES.HOME);
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
                req.flash('fields', { email: req.body.email });
                return res.redirect(ROUTES.LOGIN)
            };
            
            //Verificar si marco la casilla Recordar Datos
            if(req.body.remember){
                res.cookie('idAuthenticatedUser', user.id, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production" ? true : false,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 * 365 //1 año
                })
            }
            const redirecTo = req.session.redirectTo || ROUTES.ADMIN;
            console.log({
                redirecTo,
            })
            delete req.session.redirectTo;

            //Metodo propio de passport
            req.login(user, err => {
                if(err) {
                    req.flash("error", err.toString());
                    req.flash('fields', { email: req.body.email });
                    return res.redirect(ROUTES.LOGIN)
                }
                return res.redirect(redirecTo);
            });
        })(req, res, next);
    }catch(err){
        req.flash("error", err.message)
        req.flash('fields', { email: req.body.email });
        return res.redirect(ROUTES.LOGIN);
    }
}

export const confirmarCuenta = async (req, res) => {
    try{
        const token = req.params.token;

        //Verificar si el token es válido
        const user = await User.findOne({where: {tokenPassword: token}})
        
        if(!user){
            req.flash('error', 'Hubo un error al confirmar su cuenta. Inténtelo de nuevo')
            return res.redirect(ROUTES.LOGIN);
        }
        if(user.activo === 1){
            req.flash('error', 'Tu cuenta ya ha sido confirmada')
            return res.redirect(ROUTES.LOGIN);
        }
        if(user.expiraToken.getTime() < new Date().getTime()){
            req.flash('error', 'Lo sentimos, el enlace de confirmación ha caducado. Puede generar un nuevo vínculo de restablecimiento desde la página de inicio de sesión.')
            return res.redirect(ROUTES.LOGIN);
        }
        //Confirmar la cuenta
        user.tokenPassword = null;
        user.expiraToken = null;
        user.activo = 1;
        await user.save();

        req.flash('success', 'Cuenta confirmada exitosamente');
        return res.redirect(ROUTES.LOGIN);
    }catch(err){
        req.flash('error', err.message);
        return res.redirect(ROUTES.LOGIN);
    }
}

export const mostrarPaginaOlvidePassword = async (req, res) => {
    try{
        return res.render('auth/forgot-password', {
            nombrePagina: "Olvide Password"
        })
    }catch(err){
        req.flash("error", err.message);
        return res.redirect(ROUTES.LOGIN);
    }
}

export const olvidePassword = async (req, res) => {
    try{
        const {email} = req.body;
        let errorsExpress = validationResult(req);
        //Comprobamos si hay errores de express
        if(!errorsExpress.isEmpty()){
            let errors = errorsExpress.errors.map(err => err.msg);
            req.flash('error', errors);
            req.flash('fields', { email })
            return res.redirect(ROUTES.FORGOT_PASSWORD);
        }
        const user = await User.findOne({where: {email}});
        if(!user){
            req.flash('error', 'El email no pertenece a ningún usuario registrado');
            req.flash('fields', { email })
            return res.redirect(ROUTES.FORGOT_PASSWORD);
        }
        if(!user.activo && user.isAdmin){
            req.flash("error", "Por favor, asegúrese de que ha confirmado su cuenta antes de intentar recuperar su contraseña")
            req.flash('fields', { email })
            return res.redirect(ROUTES.FORGOT_PASSWORD);
        }
        if(!user.activo && !user.isAdmin){
            req.flash("error", "Por favor, comuniquese con su administrador para el cambio de su contraseña")
            req.flash('fields', { email })
            return res.redirect(ROUTES.FORGOT_PASSWORD);
        }
        
        //Enviar email de recuperación de password
        const token = uuidv4();
        await enviarEmailRecuperarPassword(user.nombre, user.email, token, req);
        await establecerTokenPassword(user, token, req);
        req.flash('success', 'Hemos enviado un E-mail para que recupere su password');
        res.redirect(ROUTES.FORGOT_PASSWORD);
    }catch(err){
        req.flash("error", err.message);
        res.redirect(ROUTES.FORGOT_PASSWORD);
    }
}

export const mostrarPaginaRecuperarPassword = async (req, res) => {
    try{
        const {token} = req.params;
        const user = await User.findOne({where: {tokenPassword: token}});
        console.log({
            user,
            token
        })
        if(!user){
            req.flash('error', 'Hubo un error al recuperar su password. Inténtelo de nuevo')
            return res.redirect(ROUTES.FORGOT_PASSWORD);
        }
        if(user.expiraToken.getTime() < new Date().getTime()){
            req.flash('error', 'Lo sentimos, el enlace de confirmación ha caducado. Puede generar un nuevo vínculo de restablecimiento desde la página de recuperación de password');
            return res.redirect(ROUTES.FORGOT_PASSWORD);
        }
        return res.render('auth/recover-password', {
            nombrePagina: "Recupere tu Password"
        })

    }catch(err){
        req.flash('error', err.message)
        return res.redirect(ROUTES.FORGOT_PASSWORD);
    }
}
export const recuperarPassword = async (req, res) => {
    try{
        const {token} = req.params;
        const new_password = req?.body?.new_password || "";
        const confirm_new_password = req?.body?.confirm_new_password || "";

        let errorsExpress = validationResult(req);
        console.log({
            body: req.body,
            errorsExpress: errorsExpress.errors
        })

        //Comprobamos si hay errores de express
        if(!errorsExpress.isEmpty()){
            let errors = errorsExpress.errors.map(err => err.msg);
            req.flash('error', errors);
            return res.redirect(ROUTES.RECOVER_PASSWORD.replace(":token", token));
        }
        if(new_password !== confirm_new_password){
            req.flash('error', "La confirmación del nuevo password es incorrecto");
            return res.redirect(ROUTES.RECOVER_PASSWORD.replace(":token", token));
        }
        const user = await User.findOne({where: {tokenPassword: token}});
       
        //Cambiar password
        user.password = user.hashPassword(new_password);
        user.tokenPassword = null;
        user.expiraToken = null;
        await user.save();
        req.flash('success', "Password Reestablecido Correctamente");
        res.redirect(ROUTES.LOGIN);
    }catch(err){
        req.flash('error', err.message)
        return res.redirect(ROUTES.RECOVER_PASSWORD.replace(":token", token));
    }
}
