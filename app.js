"use strict";

//Requires
var express = require("express");
var bodeyParser = require("body-parser");


//Ejecutar express
var app = express();

// Cargar archivos de rutas
var user_routes = require("./routes/user");
var curse_routes = require("./routes/curse");
var register_routes = require("./routes/register");


//Middleware
app.use(bodeyParser.urlencoded({ extended: false }));
app.use(bodeyParser.json());


//Rescribir rutas
app.use("/api", user_routes);
app.use("/api", curse_routes);
app.use("/api", register_routes);


//Exportación del modulo
module.exports = app;
