import passport from "passport";
import { v4 as uuidv4 } from 'uuid';
//Iniciar sesión en la base de datos, esta es la estrategia local
import PassportLocal from "passport-local";
import User from "../models/UserModel.js";
import {enviarEmailConfirmacion} from "../helpers/email.js";
import { establecerTokenPassword} from "../helpers/user.js";

const LocalStrategy = PassportLocal.Strategy;

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true}, async function(req, email, password, done) {
    try{
      const user = await User.findOne({ where: {email}});
      //EL arguemnto info tiene que tener la sigueitne estructura para imprimir mensajes en los redirects
      if(!user) return done(null, false, {  
          message: "Email y/o contraseña inválidos"
      });
      if(!user.comparePassword(password)) return done(null, false, {
          message: "Email y/o contraseña inválidos"
      });
      //Esto aplicarlo solamente para el usuario admin
      if(!user.activo && user.isAdmin){
          const token = uuidv4();
          await enviarEmailConfirmacion(user.nombre, user.email, token, req);
          await establecerTokenPassword(user, token);
          return done(null, false, {
              message: "Tu cuenta no ha sido confirmada. Hemos enviado un E-mail para que confirme su cuenta"
          });
      }
      //Aplicar para los usuarios colaboradores
      if(!user.activo && !user.isAdmin){
          return done(null, false, {
              message: "Tu cuenta no esta activa. Por favor comunicate con el administrador para que active tu cuenta"
          });
      }
      return done(null, user);
    }catch(err){
        return done(null, false, {
            message: err.message
        });
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try{
    const user = await User.findOne({where: {id}});
    done(null, user);
  }catch(err){
    done(err);
  }
});

export default passport;
