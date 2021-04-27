const express = require("express");

const Router = express.Router();

Router.post("/send-datos", (req, res) => {
  return res.send("enviando datos");
})

module.exports = Router;