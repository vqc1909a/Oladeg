import * as url from 'url';
import express from "express";
import path from "path";
import cookieParser from 'cookie-parser';
import session from "express-session";
import flash from 'connect-flash';
import * as dotenv from 'dotenv';
import passport from "./config/passport.js";
import {establecerVariablesGlobales, establecerProteccionCSRF} from "./middlewares/sessionMiddleware.js";

import homeRoute from "./routes/homeRoute.js";
import infoRoute from "./routes/infoRoute.js";
import anuncioRoute from "./routes/anuncioRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import programaAcademicoRoute from "./routes/programaAcademicoRoute.js";
import cursoRoute from "./routes/cursoRoute.js";
import dipĺomadoRoute from "./routes/diplomadoRoute.js";
import especializacionRoute from "./routes/especializacionRoute.js" 
import publicidadRoute from "./routes/publicidadRoute.js" 
import libroRoute from "./routes/libroRoute.js" 







import {connectDB, sequelize} from "./config/db.js";
import User from "./models/UserModel.js";
import Anuncio from "./models/AnuncioModel.js";
import ProgramaAcademico from "./models/ProgramaAcademicoModel.js";
import Libro from "./models/LibroModel.js";




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
        expires: 1000 * 60 * 60, 
    }
  }
  if(process.env.NODE_ENV === "production"){
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
  }
  app.use(session(sess));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(establecerVariablesGlobales);
  app.use(establecerProteccionCSRF);

  //Routes
  app.use('/', homeRoute);
  app.use('/', infoRoute);
  app.use('/', anuncioRoute);
  app.use('/', authRoute);
  app.use('/', adminRoute);
  app.use('/', programaAcademicoRoute);
  app.use('/', cursoRoute);
  app.use('/', dipĺomadoRoute);
  app.use('/', especializacionRoute);
  app.use('/', publicidadRoute);
  app.use('/', libroRoute);
  // app.use('/', require("./routes/libroRoute"));
  // app.use('/', require("./routes/boletinRoute"));



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
