var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hiq', function(req, res, next) {
  res.render('indexhiq', { title: 'Express' });
});

module.exports = router;
