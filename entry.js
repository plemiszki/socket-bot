var Renderer = require('./renderer.js')
var Game = require('./game.js')

document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext("2d");
  var renderer = new Renderer(context);
  var levelSequence = [
    require('./levels/level1.js'),
    require('./levels/level2.js')
  ];

  gameInstance = new Game(renderer, levelSequence);
  renderer.game = gameInstance;

  window.addEventListener("keydown", function (e) {
    gameInstance.keysDown[e.keyCode] = true;
    if (e.keyCode === 32 && gameInstance.status === "menu") {
      gameInstance.startLevel();
    }
  }, false);

  window.addEventListener("keyup", function (e) {
    delete gameInstance.keysDown[e.keyCode];
  }, false);

  gameInstance.startGame();
});
