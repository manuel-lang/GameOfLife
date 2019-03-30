var express = require('express');
var fs = require("fs");
var router = express.Router();

router.get('/', function(req, res, next) {
  var content = fs.readFileSync("public/data/characters.json");
  var characters = JSON.parse(content);
  res.render('index', { title: 'Express', characters : characters });
});

router.get('/game/:character_id', function(req, res, next) {
  var content = fs.readFileSync("public/data/questions.json");
  var questions = JSON.parse(content);
  var q = _.where(questions, {character: req.params.character_id});
  res.render('game', { questions: q });
});

module.exports = router;
