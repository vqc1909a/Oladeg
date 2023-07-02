import { check } from "express-validator";

export const editarPerfil = [
    check('nombre').trim().escape(),
    check('descripcion').trim(),
    check('email').trim().normalizeEmail(),
]

export const cambiarPassword = [
    check('password_actual').trim().escape(),
    check('nuevo_password').trim().escape().notEmpty().withMessage("El nuevo password es obligatorio").isLength({min: 6}).withMessage("El nuevo password tener al menos 6 carácteres"),
    check('confirmar_nuevo_password').trim().escape(),
]