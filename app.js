import express from "express";
import cors from 'cors';
import * as dotenv from 'dotenv';

import homeRoute from "./routes/homeRoute.js";
import infoRoute from "./routes/infoRoute.js";

dotenv.config({path: ".env"});
const app = express();
const port = process.env.PORT || 5000;


//Middleware
app.use(express.static('public'));
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');

//Routes
app.use('/', homeRoute);
app.use('/', infoRoute);
// app.use('/', require("./routes/anuncioRoute"));
// app.use('/', require("./routes/cursoRoute"));
// app.use('/', require("./routes/diplomadoRoute"));
// app.use('/', require("./routes/especializacionRoute"));
// app.use('/', require("./routes/libroRoute"));
// app.use('/', require("./routes/boletinRoute"));
// app.use('/', require("./routes/publicidadRoute"));



app.get('*', (req, res) => {
  return res.send("Page not found");
})


app.listen(port, (req, res) => {
  console.log(`Server run on port ${port}`);
})