var currentLevel = require('./testLevel.js');
var Renderer = require('./renderer.js')

function Game(renderer) {
  this.renderer = renderer;
  this.levelSequence = [];
  this.origin = [0,0]
  this.currentLevel = require('./testLevel.js')
  this.keysDown = {};
  this.robot = new Robot([0.5,0.5]);
}

const BLOCK_LENGTH = 75;

if (currentLevel.backgroundGrid.length !== currentLevel.foregroundGrid.length ||
  currentLevel.backgroundGrid[0].length !== currentLevel.foregroundGrid[0].length) {
    throw "foregroundGrid and backgroundGrid dimensions don't match!"
}
var levelWidth = currentLevel.backgroundGrid[0].length * BLOCK_LENGTH;
var levelHeight = currentLevel.backgroundGrid.length * BLOCK_LENGTH;

function Robot(pos) {
  this.x = pos[0],
  this.y = pos[1],
  this.speed = 256;
  this.draw = function () {
    renderer.drawOuterSquare([this.x, this.y], 'red');
  }
};

var update = function (modifier) {
  if (39 in game.keysDown) { //right
    if (levelWidth - game.origin[0] < BLOCK_LENGTH * 8) {
      game.origin[0] = levelWidth - (BLOCK_LENGTH * 8);
      // todo: move robot by the difference?
    } else if (game.robot.x === 263.5 && (levelWidth - game.origin[0]) > (BLOCK_LENGTH * 8)) {
      game.origin[0] += game.robot.speed * modifier;
    } else if (game.robot.x > 263.5 && (levelWidth - game.origin[0]) > (BLOCK_LENGTH * 8)) {
      game.robot.x = 263.5;
      game.origin[0] += game.robot.speed * modifier;
    } else {
      game.robot.x += game.robot.speed * modifier;
    }
  } else if (37 in game.keysDown) { //left
    if (game.origin[0] < 0) {
      game.origin[0] = 0;
    } else if (game.robot.x === 263.5 && game.origin[0] > 0) {
      game.origin[0] -= game.robot.speed * modifier;
    } else if (game.robot.x < 263.5 && game.origin[0] > 0) {
      game.robot.x = 263.5;
      game.origin[0] -= game.robot.speed * modifier;
    } else {
      game.robot.x -= game.robot.speed * modifier;
    }
  }
  if (40 in game.keysDown) { //down
    if (levelHeight - game.origin[1] < BLOCK_LENGTH * 6) {
      game.origin[1] = levelHeight - (BLOCK_LENGTH * 6);
      // todo: move game.robot by the difference?
    } else if (game.robot.y === 187.5 && (levelHeight - game.origin[1]) > (BLOCK_LENGTH * 6)) {
      game.origin[1] += game.robot.speed * modifier;
    } else if (game.robot.y > 187.5 && (levelHeight - game.origin[1]) > (BLOCK_LENGTH * 6)) {
      game.robot.y = 187.5;
      game.origin[1] += game.robot.speed * modifier;
    } else {
      game.robot.y += game.robot.speed * modifier;
    }
  } else if (38 in game.keysDown) { //up
    if (game.origin[1] < 0) {
      game.origin[1] = 0;
    } else if (game.robot.y === 187.5 && game.origin[1] > 0) {
      game.origin[1] -= game.robot.speed * modifier;
    } else if (game.robot.y < 187.5 && game.origin[1] > 0) {
      game.robot.y = 187.5;
      game.origin[1] -= game.robot.speed * modifier;
    } else {
      game.robot.y -= game.robot.speed * modifier;
    }
  }
  var coords = document.getElementById("coords");
  coords.innerHTML = "Right Side: " + game.robot.x;
};

var main = function () {
  var now = Date.now();
  var delta = now - then;
  update(delta / 1000);
  renderer.renderScreen(game.robot);
  then = now;
  window.requestAnimationFrame(main);
};

addEventListener("keydown", function (e) {
  game.keysDown[e.keyCode] = true;
  // console.log(keysDown);
}, false);

addEventListener("keyup", function (e) {
  delete game.keysDown[e.keyCode];
  // console.log(keysDown);
}, false);

var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
var renderer = new Renderer(context);
var game = new Game(renderer);
renderer.game = game;

var then = Date.now();
document.addEventListener("DOMContentLoaded", function () {
  main();
})
