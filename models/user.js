"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  image: String,
  role: String,
  date: { type: Date, default: Date.now },
});
// Eliminar password del JSON
UserSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;

  return obj;
};

module.exports = mongoose.model("User", UserSchema);
//Prularizar el nombre
//users -> doc con el mismo esquema definido
