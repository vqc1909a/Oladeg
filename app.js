import * as url from 'url';
import express from "express";
import path from "path";
import cookieParser from 'cookie-parser';
import session from "express-session";
import flash from 'connect-flash';
import * as dotenv from 'dotenv';
import {v4 as uuidv4} from "uuid";
import passport from "./config/passport.js";

import homeRoute from "./routes/homeRoute.js";
import infoRoute from "./routes/infoRoute.js";
import anuncioRoute from "./routes/anuncioRoute.js";

import {connectDB, sequelize} from "./config/db.js";
import User from "./models/UserModel.js";


dotenv.config({path: ".env"});

const app = express();
const port = process.env.PORT || 4000;
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const __filename = url.fileURLToPath(import.meta.url);

connectDB().then(async () => {
  await sequelize.sync({alter: true});
  console.log("All models were synchronized successfully.");
  app.use(express.json());    
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.set("view engine", "ejs");
  app.set('views', path.join(__dirname, "./views"));
  app.use(cookieParser());

  const sess = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60, 
        expires: 1000 * 60 * 60 
    }
  }
  if(process.env.NODE_ENV === "production"){
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
  }
  app.use(session(sess))
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use((req, res, next) => {
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

    if(!req.session.csrfToken){
        req.session.csrfToken = uuidv4();
    }

    res.cookie('XSRF-TOKEN', req.session.csrfToken, {
        httpOnly: true, // Permite que el cliente pueda leer la cookie solo desde el servidor para incluir el token CSRF en las solicitudes y no desde el navegador (javascript), o sea leer su contenido de la cookie solo desde el servidor y no desde el navegador
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: 'strict' // Solo envía la cookie a través de solicitudes del mismo sitio
    })

    res.locals.csrfToken = req.session.csrfToken;
    
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const xsrfToken = req.cookies['XSRF-TOKEN'];
        const csrfToken = req.body._csrf || req.query._csrf || req.headers['x-csrf-token'];
        if (!csrfToken || csrfToken !== req.session.csrfToken || !xsrfToken || xsrfToken !== req.session.csrfToken) {
            req.flash("error", "Token CSRF no válido o Sesión Terminada");
            return res.redirect(ROUTES.INICIAR_SESION);
        }
    }
    next();
  })
  //Routes
  app.use('/', homeRoute);
  app.use('/', infoRoute);
  app.use('/', anuncioRoute);
  // app.use('/', require("./routes/cursoRoute"));
  // app.use('/', require("./routes/diplomadoRoute"));
  // app.use('/', require("./routes/especializacionRoute"));
  // app.use('/', require("./routes/libroRoute"));
  // app.use('/', require("./routes/boletinRoute"));
  // app.use('/', require("./routes/publicidadRoute"));



  app.get('*', (req, res) => {
    return res.send("Page not found");
  })


  app.listen(port, (req, res) => {
    console.log(`Server run on port ${port}`);
  })
}).catch(err => {
    console.log(err);
    process.exit(1);
})
