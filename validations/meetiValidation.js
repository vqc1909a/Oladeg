import { check } from "express-validator";

export const crearNuevoMeeti = [
    check('groupId').trim().notEmpty().withMessage("El grupo es obligatorio"),
    check('titulo').trim().escape(),
    check('invitado').trim().escape(),
    check('fecha').trim(),
    check('hora').trim(),
    check('cupo').trim(),  
    check('descripcion').trim(),
    check('direccion').trim().escape(),
    check('ciudad').trim().escape(),
    check('estado').trim().escape(),
    check('pais').trim().escape(),
    check('cod_postal').trim().escape(),
    check('lat').trim().escape(),
    check('lng').trim().escape(),
]

export const editarMeeti = [
    check('groupId').trim().notEmpty().withMessage("El grupo es obligatorio"),
    check('titulo').trim().escape(),
    check('invitado').trim().escape(),
    check('fecha').trim(),
    check('hora').trim(),
    check('cupo').trim(),  
    check('descripcion').trim(),
    check('direccion').trim().escape(),
    check('ciudad').trim().escape(),
    check('estado').trim().escape(),
    check('pais').trim().escape(),
    check('cod_postal').trim().escape(),
    check('lat').trim().escape(),
    check('lng').trim().escape()
]