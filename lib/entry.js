import Renderer from './renderer.js';
import Game from './game.js';

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext("2d");
  const renderer = new Renderer(context);
  const levelSequence = [
    require('./levels/tutorial.js'),
    require('./levels/level1.js'),
    require('./levels/level2.js'),
    require('./levels/level3.js')
  ];

  const gameInstance = new Game(renderer, levelSequence);
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
