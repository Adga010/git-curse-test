"use strict";

var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");
var Schema = mongoose.Schema;

//Modelo de COMMENT
var RegisterSchema = Schema({
  name: String,
  surname: String,
  email: String,
  tel: String,
  date: { type: Date, default: Date.now },
  user: { type: Schema.ObjectId, ref: "User" },
});

var Register = mongoose.model("Register", RegisterSchema);

//Modelo de TOPIC

var CurseSchema = Schema({
  title: String,
  content: String,
  room: String,
  hour: String,
  date: { type: Date, default: Date.now },
  user: { type: Schema.ObjectId, ref: "User" },
  registers: [RegisterSchema],
});

// Cargar paginación
CurseSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Curse", CurseSchema);
