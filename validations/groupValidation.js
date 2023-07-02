import { check } from "express-validator";

export const crearNuevoGrupo = [
    check('nombre').trim().escape(),
    check('descripcion').trim(),
    //El valor de optional no funciona para urls, tampoco no funcionara el escape. para ello esta isURL
    // check('url').trim().if((value) => value !== '').isURL().withMessage("Ingrese una url correcta por favor"),
]

export const editarGrupo = [
    check('nombre').trim().escape(),
    check('descripcion').trim(),
    //El valor de optional no funciona para urls, tampoco no funcionara el escape. para ello esta isURL
    // check('url').trim().if((value) => value !== '').isURL().withMessage("Ingrese una url correcta por favor"),
]