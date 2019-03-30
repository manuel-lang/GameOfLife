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
  res.render('game', { questions: questions });
});

router.get('/final/:balance', function(req, res, next) {
  let balance = req.params.balance;
  if (balance > 1000000) {
    res.render('final', { balance: balance, img_src: "/img/success.png" });
  }
  else if(balance > 1000000) {
    res.render('final', { balance: balance, img_src: '/img/okay.png' });
  }
  else {
    res.render('final', { balance: balance, img_src: '/img/poor.png' });
  }
});

module.exports = router;
