import { check } from "express-validator";

//Basicamente aqui no estamos validando, estamos saneando los campos, eliminando los espacios en blanco y los caracteres especiales
export const iniciarSesion = [
    check('email').trim(),
    check('password').trim().escape()
]

export const crearNuevaCuenta = [
    check('email').trim(),
    check('nombre').trim().escape(),
    check('password').trim().escape(),
]

// sanitizeEmail puede alterar el formato original de la dirección de correo electrónico, y aplicar isEmail después de la sanitización podría dar lugar a falsos negativos en la validación.
export const olvidePassword = [
    check('email').trim().notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("Ingrese un correo válido").normalizeEmail(),
]

export const recuperarPassword = [
    check('new_password').trim().notEmpty().withMessage("El nuevo password es obligatorio"),
    check('confirm_new_password').trim().notEmpty().withMessage("La confirmación del nuevo password es obligatorio"),
]