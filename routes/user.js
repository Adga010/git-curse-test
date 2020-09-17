"use strict";

var express = require("express");
var UserController = require("../controller/user");

var router = express.Router();
var md_auth = require("../middlewares/authenticated");

var multipart = require("connect-multiparty");
var md_upload = multipart({ uploadDir: "./uploads/users" });

router.post("/register", UserController.save);
router.post("/login", UserController.login);
router.put("/update", md_auth.authenticated, UserController.update);
router.post(
  "/upload-avatar",
  [md_auth.authenticated, md_upload],
  UserController.uploadAvatar
);
router.get("/avatar/:fileName", UserController.avatar);
router.get("/users", UserController.getUsers);
router.get("/user/:userId", UserController.getUser);
router.delete('/user/:id', md_auth.authenticated, UserController.delete);

module.exports = router;
