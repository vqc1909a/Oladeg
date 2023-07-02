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