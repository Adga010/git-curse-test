"use strict";
var validator = require("validator");
var Curse = require("../models/curse");

var controller = {
  test: (req, res) => {
    return res.status(200).send({
      messaje: "metodo test",
    });
  },
  save: (req, res) => {
    // Recoger parametrso por post
    var params = req.body;

    // Validar datos
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
      var validate_room = !validator.isEmpty(params.room);
    } catch (err) {
      return res.status(500).send({
        status: "error",
        message: "Faltan datos por enviar.",
      });
    }
    if (validate_title && validate_content && validate_room) {
      // Crear objeto a guardar
      var curse = new Curse();

      // Asinar valores
      curse.title = params.title;
      curse.content = params.content;
      curse.room = params.room;
      curse.user = req.user.sub;

      // Guardar el topic
      curse.save((err, curseStored) => {
        if (err || !curseStored) {
          return res.status(200).send({
            status: "error",
            messajg: "el curso no se ha guardado",
          });
        }
        // Devolver respuesta
        return res.status(200).send({
          status: "success",
          curse: curseStored,
        });
      });
    } else {
      return res.status(200).send({
        message: "Los datos no son validos",
      });
    }
  },
  getCurses: (req, res) => {
    // Carga la libreria de paginación

    // Recoger la pagina actual
    if (
      !req.params.page ||
      req.params.page == null ||
      req.params.page == 0 ||
      req.params.page == "0" ||
      req.params.page == undefined
    ) {
      var page = 1;
    } else {
      var page = parseInt(req.params.page);
    }

    // Indicar las opciones de paginación
    var opciones = {
      sort: { date: -1 },
      populate: "user",
      limit: 5,
      page: page,
    };
    // Find paginado
    Curse.paginate({}, opciones, (err, curses) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al hacer la consulta!",
        });
      }

      if (!curses) {
        return res.status(404).send({
          status: "error",
          message: "No hay cursos!",
        });
      }
      //Devolver resultado(topics, total de topics, total de paginas)
      return res.status(200).send({
        status: "success",
        curse: curses.docs,
        totalDocs: curses.totalDocs,
        totalPages: curses.totalPages,
      });
    });
  },
  getCursesByUser: (req, res) => {
    // Conseguir id del usuario
    var userId = req.params.user;

    // Fin con condición del usuario
    Curse.find({
      user: userId,
    })
      .sort([["date", "descending"]])
      .exec((err, curses) => {
        if (err) {
          //Devolver un resultado
          return res.status(500).send({
            status: "error",
            message: "Error en la petición",
          });
        }
        if (!curses) {
          return res.status(404).send({
            status: "error",
            message: "No hay cursos para mostrar",
          });
        }
        //Devolver un resultado
        return res.status(200).send({
          status: "success",
          curses,
        });
      });
  },
  getCurse: (req, res) => {
    // Conseguir el id del usuario
    var curseId = req.params.id;

    // Find con una condición
    Curse.findById(curseId)
      .populate("user")
      .exec((err, curse) => {
        if (err) {
          return res.status(200).send({
            status: "error",
            message: "Error en la petición",
          });
        }
        if (!curse) {
          return res.status(200).send({
            status: "error",
            message: "No existe el tema",
          });
        }
        // Devolver resultado
        return res.status(200).send({
          status: "success",
          curse,
        });
      });
  },
  update: (req, res) => {
    // Recoger el id del curso URL
    var curseId = req.params.id;

    // Recoger los datos que lleguen del post
    var params = req.body;

    // valida la datos
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
      var validate_room = !validator.isEmpty(params.room);
    } catch (err) {
      return res.status(200).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    if (validate_title && validate_content && validate_room) {
      //Montar un JSON, con datos modificables
      var update = {
        title: params.title,
        content: params.content,
        room: params.room,
      };
      // Find and update del curso por id, y id de usuario
      Curse.findByIdAndUpdate(
        { _id: curseId, user: req.user.sub },
        update,
        { new: true },
        (err, curseUpdate) => {
          if (err) {
            //Devolver una respuesta
            return res.status(500).send({
              status: "error",
              message: "Error en la petición",
            });
          }
          if (!curseUpdate) {
            return res.status(404).send({
              status: "error",
              message: "El curso no se ha actualizado",
            });
          }
          return res.status(200).send({
            status: "success",
            curse: curseUpdate,
          });
        }
      );
    } else {
      // Devolver una respuesta
      return res.status(200).send({
        message: "La validación de los datos no es correcta",
      });
    }
  },
  delete: (req, res) => {
    // Sacar el id d ela url
    var curseId = req.params.id;
    Curse.findByIdAndDelete(
      {
        _id: curseId,
        user: req.user.sub,
      },
      (err, curseRemove) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Error en la petición",
          });
        }
        if (!curseRemove) {
          return res.status(404).send({
            status: "error",
            message: "El curso no se ha eliminado",
          });
        }
        //Devolver una respuesta
        return res.status(200).send({
          status: "success",
          curse: curseRemove,
        });
      }
    );
  },
  search: (req, res) => {
    // Recoger el string de la URL
    var searchString = req.params.search;
    console.log(searchString);

    // Find Or

    Curse.find({
      $or: [
        { title: { $regex: searchString, $options: "i" } },
        { content: { $regex: searchString, $options: "i" } },
        { room: { $regex: searchString, $options: "i" } },
      ],
    })
      .sort([["date", "descending"]])
      .exec((err, curses) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Erro en la petición",
            err,
          });
        }
        if (!curses) {
          return res.status(404).send({
            status: "error",
            message: "No existen datos en la busqueda.",
          });
        }
        // Devolver una respuesta
        return res.status(200).send({
          status: "success",
          curse: curses,
        });
      });
  },
};
module.exports = controller;
