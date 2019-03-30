var express = require('express');
var fs = require("fs");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var content = fs.readFileSync("public/data/characters.json");
  var characters = JSON.parse(content);
  res.render('index', { title: 'Express', characters : characters });
});

router.get('/game', function(req, res, next) {
  res.render('game', { character: req.query.id });
});

module.exports = router;
