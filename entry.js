var Renderer = require('./renderer.js')
var Game = require('./game.js')

document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext("2d");
  var renderer = new Renderer(context);
  gameInstance = new Game(renderer);
  renderer.game = gameInstance;

  window.addEventListener("keydown", function (e) {
    gameInstance.keysDown[e.keyCode] = true;
  }, false);

  window.addEventListener("keyup", function (e) {
    delete gameInstance.keysDown[e.keyCode];
  }, false);

  gameInstance.startLevel(gameInstance.levelSequence[0]);
});
