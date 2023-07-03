import { check } from "express-validator";

//Basicamente aqui no estamos validando, estamos saneando los campos, eliminando los espacios en blanco y los caracteres especiales
export const iniciarSesion = [
    check('email').trim().normalizeEmail(),
    check('password').trim().escape()
]

export const crearNuevaCuenta = [
    check('email').trim().normalizeEmail(),
    check('nombre').trim().escape(),
    check('password').trim().escape(),
]

export const olvidePassword = [
    check('email').trim().normalizeEmail().notEmpty().withMessage("El correo es obligatorio"),
]

export const recuperarPassword = [
    check('new_password').trim().normalizeEmail().notEmpty().withMessage("El nuevo password es obligatorio"),
    check('confirm-new_password').trim().normalizeEmail().notEmpty().withMessage("La confirmación del nuevo password es obligatorio"),

]