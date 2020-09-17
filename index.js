"use strict";

//Conexión a la base de datos
var mongoose = require("mongoose");

/*Exportar modulo app*/
var app = require('./app');
var port = process.env.PORT || 3555;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost:27017/rest-node", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("La conexión a la base de datos de MONGO se ha realizado :)");
    //Crear el servidor
    app.listen(port, () => {
      console.log("El servidor esta corriendo con el puerto: 3555 :)");
    });
  })
  .catch((error) => console.log(error));
