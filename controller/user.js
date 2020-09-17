"use strict";
var validator = require("validator");
var User = require("../models/user");
var bcrypt = require("bcrypt-nodejs");
var JWT = require("../services/jwt");
var fs = require("fs");
var path = require("path");

var controller = {
  save: (req, res) => {
    //Recoger los parametros de la petición
    var params = req.body;

    //Validar los datos
    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_surname = !validator.isEmpty(params.surname);
      var validate_email =
        !validator.isEmpty(params.email) && validator.isEmail(params.email);
      var validate_psw = !validator.isEmpty(params.password);
    } catch (err) {
      return res.status(200).send({
        message: "Faltan datos por enviar",
      });
    }

    if (validate_name && validate_surname && validate_email && validate_psw) {
      //Crear objeto de usuario
      var user = new User();

      //Asignar valores al objeto
      user.name = params.name;
      user.surname = params.surname;
      user.email = params.email.toLowerCase();
      user.role = "ROLE_USER";
      user.image = null;

      //Comprobar si el usuario existe
      User.findOne({ email: user.email }, (err, issetUser) => {
        if (err) {
          return res.status(500).send({
            message: "Error al comprobar duplicidad de usuario",
          });
        }
        if (!issetUser) {
          //Si no existe,
          //-cifrar contraseña
          bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;
            //-guardarlo
            user.save((err, userStored) => {
              if (err) {
                return res.status(500).send({
                  message: "Error al guardar el usuario",
                });
              }

              if (!userStored) {
                return res.status(400).send({
                  message: "El usuario no se ha guardado",
                });
              }

              //Devolver respuesta
              return res.status(200).send({
                status: "success",
                user: userStored,
              });
            }); //Close save
          }); //Close bcrypt
        } else {
          return res.status(200).send({
            message: "El usuario ya esta registrado!",
          });
        }
      });
    } else {
      return res.status(200).send({
        message: "La validación de los datos es incorrecta. intentalo de nuevo",
      });
    }
  },
  login: (req, res) => {
    //Recoger los parametros de la petición
    var params = req.body;

    //Validar
    try {
      var validate_email =
        !validator.isEmpty(params.email) && validator.isEmail(params.email);
      var validate_psw = !validator.isEmpty(params.password);
    } catch (err) {
      return res.status(200).send({
        message: "Faltan datos por enviar!",
      });
    }

    if (!validate_email || !validate_psw) {
      return res.status(200).send({
        message: "Los datos son incorrectos, envialos bien",
      });
    }

    //Buscar usuarios que coincidan con email
    User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
      if (err) {
        return res.status(500).send({
          message: "Error al intentar identificarse!",
        });
      }
      if (!user) {
        return res.status(404).send({
          message: "El usuario no existe!",
        });
      }

      //si lo encuentra,
      //Comprobar la contraseña (coincidencia de email y psw / bcrypt)
      bcrypt.compare(params.password, user.password, (err, check) => {
        //Si es correcto,
        if (check) {
          //Generar token de JWT y devolverlo
          if (params.gettoken) {
            //Devolver los datos
            return res.status(200).send({
              token: JWT.createToken(user),
            });
          } else {
            //Limpiar el objeto
            user.password = undefined;

            //Devolver los datos
            return res.status(200).send({
              message: "success",
              user,
            });
          }
        } else {
          return res.status(404).send({
            message: "las credenciales no son correctas!",
          });
        }
      });
    });
  },
  update: (req, res) => {
    //Recoger los datos de usuario
    var params = req.body;

    //Validar datos
    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_surname = !validator.isEmpty(params.surname);
      var validate_email =
        !validator.isEmpty(params.email) && validator.isEmail(params.email);
    } catch (err) {
      return res.status(200).send({
        message: "Faltan datos por enviar!",
        params,
      });
    }

    //Eliminar propiedades innecesarias
    delete params.password;

    var userId = req.user.sub;

    //Comprobar si el email es unico
    if (req.user.email != params.email) {
      User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
        if (err) {
          return res.status(500).send({
            message: "Error al intentar identificarse!",
          });
        }
        if (user && user.email == params.email) {
          return res.status(200).send({
            message: "El email no puede ser modificado!",
          });
        } else {
          User.findOneAndUpdate(
            { _id: userId },
            params,
            { new: true },
            (err, userUpdate) => {
              if (err) {
                return res.status(500).send({
                  status: "error",
                  message: "Error al actualizar usuario!",
                });
              }
              if (!userUpdate) {
                return res.status(200).send({
                  status: "error",
                  message: "No se a actualizado el usuario!",
                });
              }
              //Devolver respuesta
              return res.status(200).send({
                status: "success",
                user: userUpdate,
              });
            }
          );
        }
      });
    } else {
      //Buscar y actualizar documento
      User.findOneAndUpdate(
        { _id: userId },
        params,
        { new: true },
        (err, userUpdate) => {
          if (err) {
            return res.status(500).send({
              status: "error",
              message: "Error al actualizar usuario!",
            });
          }
          if (!userUpdate) {
            return res.status(200).send({
              status: "error",
              message: "No se a actualizado el usuario!",
            });
          }
          //Devolver respuesta
          return res.status(200).send({
            status: "success",
            user: userUpdate,
          });
        }
      );
    }
  },
  uploadAvatar: (req, res) => {
    // Configurar el modulo para avilitar la subida de imagenes
    // Recoger el fichero de la petición
    var file_name = "Avatar no subido...";

    if (!req.files) {
      return res.status(404).send({
        status: "error",
        message: file_name,
      });
    }

    // conseguir el nombre y ext del archivo cargado
    var file_path = req.files.file0.path;
    var file_split = file_path.split("\\");

    // Nombre del archivo
    var file_name = file_split[2];

    //Ext del archivovar
    var ext_split = file_name.split(".");
    var file_ext = ext_split[1];

    // Comprobar la ext, solo imagenes
    if (
      file_ext != "png" &&
      file_ext != "jpg" &&
      file_ext != "jpeg" &&
      file_ext != "gif"
    ) {
      fs.unlink(file_path, (err) => {
        return res.status(200).send({
          status: "error",
          message: "La extención del archivo no es valida!",
          file: file_ext,
        });
      });
    } else {
      // Devolver usuario identificado
      var userId = req.user.sub;

      // Buscar y actualizar documento de la BD
      User.findByIdAndUpdate(
        { _id: userId },
        { image: file_name },
        { new: true },
        (err, userUpdated) => {
          if (err || !userUpdated) {
            //Devolver respuesta
            return res.status(500).send({
              status: "error",
              message: "Error al guardar el usuario!",
              file: file_ext,
            });
          }
          //Devolver respuesta
          return res.status(200).send({
            status: "success",
            user: userUpdated,
          });
        }
      );
    }
  },
  avatar: (req, res) => {
    var fileName = req.params.fileName;
    var pathFile = "./uploads/users/" + fileName;

    fs.exists(pathFile, (exists) => {
      if (exists) {
        return res.sendFile(path.resolve(pathFile));
      } else {
        return res.status(404).send({
          message: "La imagen no existe",
        });
      }
    });
  },
  getUsers: (req, res) => {
    User.find().exec((err, users) => {
      if (err || !users) {
        return res.status(404).send({
          status: "error",
          menssage: "No hay usuarios que mostrar!",
        });
      }
      return res.status(200).send({
        status: "success",
        users,
      });
    });
  },
  getUser: (req, res) => {
    var userId = req.params.userId;

    User.findById(userId).exec((err, user) => {
      if (err || !user) {
        return res.status(404).send({
          status: "error",
          menssage: "No existe el usuario!",
        });
      }
      return res.status(200).send({
        status: "success",
        user,
      });
    });
  },
  delete: (req, res) => {
    //Sacar el id del topic de la URL
    var userId = req.params.id;
    //Find and delete por Topic id y user id
    User.findByIdAndDelete(
      { _id: userId, user: req.user.sub },
      (err, userRemove) => {
        if (err) {
          //Devolver una respuesta
          return res.status(500).send({
            status: "error",
            message: "Error en la petición",
          });
        }
        if (!userRemove) {
          return res.status(404).send({
            status: "error",
            message: "El usuario no se ha eliminado",
          });
        }

        //Devolver una respuesta
        return res.status(200).send({
          status: "success",
          user: userRemove,
        });
      }
    );
  },
};

module.exports = controller;
