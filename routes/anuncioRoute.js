import express from "express";
const Router = express.Router();
import * as anuncioController from "../controllers/anuncioController.js";

Router.get('/anuncio/:anuncio', anuncioController.mostrarAnuncio);

export default Router;
