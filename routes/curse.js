"use strict";

var express = require("express");
var CurseController = require("../controller/curse");

var router = express.Router();
var md_auth = require("../middlewares/authenticated");

router.get("/test", CurseController.test);
router.post("/curse", md_auth.authenticated, CurseController.save);
router.get("/curses/:page?", CurseController.getCurses);
router.get("/user-curses/:user", CurseController.getCursesByUser);
router.get("/curse/:id", CurseController.getCurse);
router.put("/curse/:id", md_auth.authenticated, CurseController.update);
router.delete("/delete/:id", md_auth.authenticated, CurseController.delete);
router.get("/search/:search", CurseController.search);

module.exports = router;
