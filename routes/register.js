'use strict'

var express = require('express');
var RegisterController = require("../controller/register");

var router = express.Router();
var md_auth = require("../middlewares/authenticated");

router.post('/register/curse/:curseId', md_auth.authenticated, RegisterController.add);
router.put('/register/:registerId', md_auth.authenticated, RegisterController.update);
router.delete('/register/:curseId/:registerId', md_auth.authenticated, RegisterController.delete);


module.exports = router;