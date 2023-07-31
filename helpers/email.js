import * as ROUTES from "../config/routes.js";
import { transport, transportNoReply } from "../config/email.js";




export const enviarEmailContacto = async (body, req) => {
    const {nombres, correo, celular, mensaje} = body;
    const nombreDestinatario = "Roberth";
    const sitioWeb = "oladeg.org"
    const correoEmisor = "roberth@oladeg.org";

    const textBody = `
    <div style="padding: 10px;">
        <div style="display: flex; justify-content: center; align-items: center">
            <img src="${req.protocol}://${req.get('host')}/dist/images/logo.jpg" width="300" alt="Logo Oladeg" />
        </div>
        <p>¡Estimado/a ${nombreDestinatario}!</p>

        <p>Espero que te encuentres bien. Quería informarte que hemos recibido un nuevo mensaje de contacto a través del formulario del sitio web ${sitioWeb}.</p>

<        <p><strong>Detalles del mensaje:</strong></p>

        <p><strong>Nombres:</strong> ${nombres}<br/>
        <strong>Correo:</strong> ${correo}<br/>
        <strong>Whatsapp:</strong> ${celular}<br/>
        <strong>Mensaje: </strong> ${mensaje}</p>

        <p>Por favor, responde a este correo o ponte en contacto con el usuario lo antes posible para atender su consulta o solicitud.</p>

        <p>¡Gracias por tu atención!</p>
    </div>
    `;

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
    <title>Nuevo mensaje de contacto de ${sitioWeb}</title>
    </head>
    <body style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: rgba(0, 0, 0, 1); background-color: rgba(247, 245, 245, 1));">
        ${textBody}
    </body>
    </html>
    `;

    let info = await transport.sendMail({
        from: `"Oladeg 🏡" <${correoEmisor}>`,
        to: `${correoEmisor}`,
        replyTo: correo,
        subject: `Nuevo mensaje de contacto de ${sitioWeb}`,
        text: textBody,
        html: htmlBody
    })
    console.log("Message sent: %s", info.messageId);
}

export const enviarEmailConfirmacionCuenta = async (nombre, email, token, req) => {
   //El transport se va a autenticar en mailtrap y acceder a sus servicio de mailtrap
   let info = await transportNoReply.sendMail({
    from: '"Oladeg 🏡" <no-reply@oladeg.org>',
    to: email,
    subject: "Confirma tu cuenta en Oladeg",
    text: `Hola ${nombre}, confirma tu cuenta en Oladeg`,
    html: `
        <h1 style="text-align: center; font-family: Arial, Helvetica;">Confirma tu Cuenta</h1>
        <p style="font-family: Arial, Helvetica">Hola ${nombre}, confirma tu cuenta en Oladeg</p>

        <p style="font-family: Arial, Helvetica">Tu cuenta ya esta lista, estas a un paso de comenzar a crear una comunidad en Oladeg, solo debes confirmarla en las próximas 24 horas a través del siguiente enlace:</p>
        <a style="display: block; font-family: Arial, Helvetica; padding: 1rem; background-color: #00C897; color: white; text-transform: uppercase; text-align: center; text-decoration: none;" href="${req.protocol}://${req.get('host')}${ROUTES.CONFIRM_ACCOUNT.replace(':token', token)}">Confirmar cuenta</a>

        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p >
    `
   })
    console.log("Message sent: %s", info.messageId);
}

export const enviarEmailRecuperarPassword = async (nombre, email, token, req) => {
   //El transport se va a autenticar en mailtrap y acceder a sus servicio de mailtrap
   let info = await transportNoReply.sendMail({
    from: '"Oladeg 🏡" <no-reply@oladeg.org>', /* "Oladeg" <noreply@empresa.com> => en caso de que no esperas respuestas de los destinatarios*/
    to: email,
    subject: "Reestablece tu Password en Oladeg",
    text: `Hola ${nombre}, reestablece tu password en Oladeg`,
    html: `
        <p>Hola ${nombre}, has solicitado reestablecer tu password en Oladeg</p>

        <p>Sigue el siguiente enlace para reestablecer su password: <a href="${req.protocol}://${req.get('host')}${ROUTES.RECOVER_PASSWORD.replace(':token', token)}">Reestablecer Password</a></p>

        <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje</p >
    `
   })
    console.log("Message sent: %s", info.messageId);
}

export const enviarEmailConfirmacionNuevoCorreo = async (nombre, email, token, req) => {
   //El transport se va a autenticar en mailtrap y acceder a sus servicio de mailtrap
   let info = await transportNoReply.sendMail({
    from: '"Oladeg 🏡" <no-reply@oladeg.org>',
    to: email,
    subject: "Confirma tu nuevo correo en Oladeg",
    
    text: `Hola ${nombre}, confirma tu nuevo correo en Oladeg`,
    html: `
        <h1 style="text-align: center; font-family: Arial, Helvetica;">Confirma tu nuevo correo</h1>
        <p style="font-family: Arial, Helvetica">Hola ${nombre}, confirma tu nuevo correo en Oladeg</p>

        <p style="font-family: Arial, Helvetica">Tu nuevo correo ya esta lista, solo debes confirmarla en las próximas 24 horas a través del siguiente enlace:</p>
        <a style="display: block; font-family: Arial, Helvetica; padding: 1rem; background-color: #00C897; color: white; text-transform: uppercase; text-align: center; text-decoration: none;" href="${req.protocol}://${req.get('host')}${ROUTES.CONFIRM_NEW_EMAIL.replace(':token', token)}?email=${email}">Confirmar nuevo correo</a>

        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p >
    `
   })
    console.log("Message sent: %s", info.messageId);
}
