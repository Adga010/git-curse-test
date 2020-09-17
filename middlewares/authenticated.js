"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "clave-secreta-para-generar-el-token-666";

exports.authenticated = (req, res, next) => {
  // comprobar si llega autorización
  if (!req.headers.authorization) {
    return res.status(403).send({
      message: "La petición no tiene cabecera de autorización",
    });
  }

  // Limpiar el token y quitar comillas
  var token = req.headers.authorization.replace(/['"]+/g, '');

  try{
    // Decodificar Token
    var payload = jwt.decode(token, secret);
    
    // Comprobar si el token a expirtado
    if(payload.exp <= moment().unix()){
      return res.status(404).send({
        message: "el token ha expirado",
      });
    }

  }catch(ex){
    return res.status(404).send({
      message: "el token no es valido",
    });
  }
  // Adjuntar usuario identificado a la request
  req.user = payload;
  // Pasar a la acción
  next();
};
