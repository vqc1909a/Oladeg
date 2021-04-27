const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 4000;
require('dotenv').config();
//Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'ejs');
app.set('views', './views');
//Routes
app.use('/', require("./routes/infoRoute"));
app.use('/', require("./routes/contactoRoute"));





app.get('*', (req, res) => {
  return res.send("Page not found");
})


app.listen(port, (req, res) => {
  console.log(`Server run on port ${port}`);
})