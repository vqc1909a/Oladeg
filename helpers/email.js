import nodemailer from "nodemailer";
import dotenv from "dotenv";
import * as ROUTES from "../config/routes.js";

dotenv.config({path: ".env"});

const transport = nodemailer.createTransport({
    host: process.env.NODE_ENV === "production" ?  process.env.EMAIL_HOST :  process.env.EMAIL_HOST_DEV,
    port: process.env.NODE_ENV === "production" ?  process.env.EMAIL_PORT :  process.env.EMAIL_PORT_DEV,
    secure: process.env.NODE_ENV === "production" ? true : false,
    auth: {
        user: process.env.NODE_ENV === "production" ? process.env.EMAIL_USER : process.env.EMAIL_USER_DEV,
        pass: process.env.NODE_ENV === "production" ? process.env.EMAIL_PASS : process.env.EMAIL_PASS_DEV 
    }
});

export const enviarEmailConfirmacion = async (nombre, email, token, req) => {
   //El transport se va a autenticar en mailtrap y acceder a sus servicio de mailtrap
   let info = await transport.sendMail({
    from: '"Meeti 🏡" <vqc1909a@rosec.online>',
    to: email,
    subject: "Confirma tu cuenta en Meeti",
    text: `Hola ${nombre}, confirma tu cuenta en Meeti`,
    html: `
        <h1 style="text-align: center; font-family: Arial, Helvetica;">Confirma tu Cuenta</h1>
        <p style="font-family: Arial, Helvetica">Hola ${nombre}, confirma tu cuenta en Meeti</p>

        <p style="font-family: Arial, Helvetica">Tu cuenta ya esta lista, estas a un paso de comenzar a crear una comunidad en Meeti, solo debes confirmarla en las próximas 24 horas a través del siguiente enlace:</p>
        <a style="display: block; font-family: Arial, Helvetica; padding: 1rem; background-color: #00C897; color: white; text-transform: uppercase; text-align: center; text-decoration: none;" href="${req.protocol}://${req.get('host')}${ROUTES.CONFIRMAR_CUENTA.replace(':token', token)}">Confirmar cuenta</a>

        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p >
    `
   })
    console.log("Message sent: %s", info.messageId);
}

export const enviarEmailRecuperación = async (nombre, email, token, req) => {
   //El transport se va a autenticar en mailtrap y acceder a sus servicio de mailtrap
   let info = await transport.sendMail({
    from: '"Meeti 🏡" <vqc1909a@rosec.online>', /* "Meeti" <noreply@empresa.com> => en caso de que no esperas respuestas de los destinatarios*/
    to: email,
    subject: "Reestablece tu Password en Meeti",
    text: `Hola ${nombre}, reestablece tu password en Meeti`,
    html: `
        <p>Hola ${nombre}, has solicitado reestablecer tu password en Meeti</p>

        <p>Sigue el siguiente enlace para recuperar su cuenta: <a href="${req.protocol}://${req.get('host')}/account/reset-password/${token}">Reestablecer Password</a></p>

        <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje</p >
    `
   })
    console.log("Message sent: %s", info.messageId);
}

export const enviarEmailConfirmacionNuevoCorreo = async (nombre, email, token, req) => {
   //El transport se va a autenticar en mailtrap y acceder a sus servicio de mailtrap
   let info = await transport.sendMail({
    from: '"Meeti 🏡" <vqc1909a@rosec.online>',
    to: email,
    subject: "Confirma tu nuevo correo en Meeti",
    text: `Hola ${nombre}, confirma tu nuevo correo en Meeti`,
    html: `
        <h1 style="text-align: center; font-family: Arial, Helvetica;">Confirma tu nuevo correo</h1>
        <p style="font-family: Arial, Helvetica">Hola ${nombre}, confirma tu nuevo correo en Meeti</p>

        <p style="font-family: Arial, Helvetica">Tu nuevo correo ya esta lista, solo debes confirmarla en las próximas 24 horas a través del siguiente enlace:</p>
        <a style="display: block; font-family: Arial, Helvetica; padding: 1rem; background-color: #00C897; color: white; text-transform: uppercase; text-align: center; text-decoration: none;" href="${req.protocol}://${req.get('host')}${ROUTES.CONFIRMAR_NUEVO_CORREO.replace(':token', token)}?email=${email}">Confirmar nuevo correo</a>

        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p >
    `
   })
    console.log("Message sent: %s", info.messageId);
}
