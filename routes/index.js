var express = require('express');
var router = express.Router();
let PackageJSON = require("../package.json");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { appversion: PackageJSON.version });
});

module.exports = router;
