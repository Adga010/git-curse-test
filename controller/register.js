"use strict";

var Curse = require("../models/curse");
var validator = require("validator");

var controller = {
  add: (req, res) => {
    // Recoger el ID del curso de la URL
    var curseId = req.params.curseId;

    // Find del ID del curso
    Curse.findById(curseId).exec((err, curse) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error en la petición",
        });
      }
      if (!curse) {
        return res.status(404).send({
          status: "error",
          message: "No existe el curso",
        });
      }
      // Comprobar usuario y validar datos
      if (req.body.tel) {
        try {
          var validate_tel = !validator.isEmpty(req.body.tel);
        } catch (err) {
          return res.status(200).send({
            message: "No ha ingresado los valores",
          });
        }

        if (validate_tel) {
          var regi = {
            user: req.user.sub,
            name: req.user.name,
            surname: req.user.surname,
            email: req.user.email,
            tel: req.body.tel,
          };
          console.log("Regi: ", regi.email);

          // console.log("Regi mail: ", regi.title);
          // console.log("Curse regis: ", curse.registers);
          // console.log(curse.registers);

          curse.registers.map((cur) => {
            // var Curs = cur.email;
            // console.log("curs:", Curs);
            if (cur.email == req.user.email) {
              console.log("cur:", cur.email);
              Curse.findOne(
                { "registers.email": req.user.email },
                (err, emailRep) => {
                  console.log("emailRep:", emailRep);
                  if (err) {
                    return res.status(500).send({
                      message: "Error al intentar identificarse!",
                    });
                  }
                }
              );
              // console.log("REGISTROS: ", cur.email);
              console.log("LOS REGISTROS SON IGUALES!!");
            } else {
              console.log("LOS REGISTROS NO SON IGUALES!!");
            }
          });

          //   console.log("cur:", cur.email);
          //   if (cur.email == req.user.email) {
          //     console.log("LOS REGISTROS SON IGUALES!!");
          //     // return res.status(500).send({
          //     //   status: "error",
          //     //   message: "No actualiza el comentario",
          //     // });
          //   } else {
          //     console.log("LOS REGISTROS NO SON IGUALES!!");
          //     curse.registers.push(regi);
          //     curse.save((err) => {
          //       if (err) {
          //         return res.status(404).send({
          //           status: "error",
          //           message: "Error al registar",
          //         });
          //       }
          //     });
          //   }
          // })

          // (err, issetUser) => {
          //   console.log("issetUser: ", issetUser);
          //   if (err) {
          //     return res.status(500).send({
          //       message: "Error al comprobar duplicidad de usuario",
          //     });
          //   }
          //   if (!issetUser) {
          //     curse.registers.push(regi);
          //     curse.save((err) => {
          //       if (err) {
          //         return res.status(200).send({
          //           status: "error",
          //           message: "Error al registar",
          //         });
          //       }
          //     });
          //   } else {
          //     var cu = curse.registers;
          //     curse.registers.map((cur) => {
          //       console.log("Funcion .map", cur.email);

          //       if (cur.email == regi.email) {
          //         console.log("DUPLICIDAD!!!");
          //         return res.status(404).send({
          //           status: "error",
          //           message: "Error, duplicidad!!!",
          //         });
          //       } else {
          //         curse.registers.push(regi);
          //         curse.save((err) => {
          //           if (err) {
          //             return res.status(300).send({
          //               status: "error",
          //               message: "Error al registar",
          //             });
          //           }
          //         });
          //       }
          //     });
          //   }
          // }
        }

        // if (cur.email == regi.email) {
        //   return res.status(500).send({
        //     message: "Error",
        //   });
        // }
        // Curse.findOne(
        //   // console.log("linea register email: ", curse.registers.email),
        //   { "registers.email": req.params.email },
        //   (err, issetUser) => {
        //     if (err) {
        //       return res.status(500).send({
        //         message: "Error al comprobar duplicidad de usuario",
        //       });
        //     }
        //     // console.log("print inset: ", issetUser.registers);
        //     // console.log("print curse: ", curse.registers);
        //     if (issetUser) {
        //       // En propiedad registros hacer un push
        //       curse.registers.push(regi);
        //       // Guardar el curso completo
        //       curse.save((err) => {
        //         if (err) {
        //           console.log(err);
        //           return res.status(500).send({
        //             status: "error",
        //             message: "Error al guardar el registro",
        //           });
        //         }
        //         // Devolver respues
        //         return res.status(200).send({
        //           status: "Success",
        //           curse,
        //         });
        //       });
        //     } else {
        //       return res.status(200).send({
        //         message: "El usuario ya esta registrado",
        //       });
        //     }
        //   }
        // );
        else {
          return res.status(202).send({
            message: "No han ingresado los datos",
          });
        }
      }
    });
  },
  update: (req, res) => {
    return res.status(200).send({
      status: "Success",
      message: "Metodo update registros",
    });
  },
  delete: (req, res) => {
    return res.status(200).send({
      status: "Success",
      message: "Metodo delete registros",
    });
  },
};
module.exports = controller;
