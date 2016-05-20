var Renderer = require('./renderer.js')
var Robot = require('./robot.js')

function Game(renderer) {
  this.renderer = renderer;
  this.levelSequence = [];
  this.origin = [0,0]
  this.currentLevel = require('./testLevel.js')
  this.keysDown = {};
  this.robot = new Robot([75.5,75.5]);
  this.BLOCK_LENGTH = 75;
  this.levelWidth = this.currentLevel.backgroundGrid[0].length * this.BLOCK_LENGTH;
  this.levelHeight = this.currentLevel.backgroundGrid.length * this.BLOCK_LENGTH;

  if (this.currentLevel.backgroundGrid.length !== this.currentLevel.foregroundGrid.length ||
    this.currentLevel.backgroundGrid[0].length !== this.currentLevel.foregroundGrid[0].length) {
      throw "foregroundGrid and backgroundGrid dimensions don't match!"
  }
}

Game.prototype.main = function (passedThen) {
  var now = Date.now();
  var delta = now - passedThen;
  this.update(delta / 1000);
  this.renderer.renderScreen();
  newThen = now;
  window.requestAnimationFrame(function () {
    gameInstance.main(newThen);
  });
};

Game.prototype.moveLeft = function (pixels, modifier) {
  var returnOrigin = this.origin;
  var returnPos = [this.robot.x, this.robot.y];

  if (this.origin[0] < 0) {
    returnOrigin[0] = 0;
  } else if (this.robot.x === 263.5 && this.origin[0] > 0) {
    returnOrigin[0] -= pixels * modifier;
  } else if (this.robot.x < 263.5 && this.origin[0] > 0) {
    returnPos[0] = 263.5;
    returnOrigin[0] -= pixels * modifier;
  } else {
    returnPos[0] -= pixels * modifier;
  }
  return [returnOrigin, returnPos];
};

Game.prototype.update = function (modifier) {
  var ghostPosX = this.robot.x;
  var ghostPosY = this.robot.y;
  var ghostPos = [ghostPosX, ghostPosY];
  var ghostOrigin = this.origin;

  if (39 in this.keysDown) { //right
    if (this.levelWidth - this.origin[0] < this.BLOCK_LENGTH * 8) {
      ghostOrigin[0] = this.levelWidth - (this.BLOCK_LENGTH * 8);
    } else if (this.robot.x === 263.5 && (this.levelWidth - this.origin[0]) > (this.BLOCK_LENGTH * 8)) {
      ghostOrigin[0] += this.robot.speed * modifier;
    } else if (this.robot.x > 263.5 && (this.levelWidth - this.origin[0]) > (this.BLOCK_LENGTH * 8)) {
      ghostPos[0] = 263.5;
      ghostOrigin[0] += this.robot.speed * modifier;
    } else {
      ghostPos[0] += this.robot.speed * modifier;
    }
    this.setGhostToReal(ghostPos, ghostOrigin);
  } else if (37 in this.keysDown) { //left
    var returnArrays = this.moveLeft(this.robot.speed, modifier);
    ghostOrigin = returnArrays[0];
    ghostPos = returnArrays[1];
    ghostCol = this.getColumn(ghostPos, ghostOrigin)
    if (this.currentLevel.foregroundGrid[1][ghostCol] == "block") {
      robotX = this.getRealX([this.robot.x, this.robot.y], this.origin);
      edge = 0.5 + ((ghostCol + 1) * this.BLOCK_LENGTH);
      difference = robotX - edge;
      returnArrays = this.moveLeft(difference, 1);
      ghostOrigin = returnArrays[0];
      ghostPos = returnArrays[1];
    }
    this.setGhostToReal(ghostPos, ghostOrigin);
  }
  if (40 in this.keysDown) { //down
    if (this.levelHeight - this.origin[1] < this.BLOCK_LENGTH * 6) {
      ghostOrigin[1] = this.levelHeight - (this.BLOCK_LENGTH * 6);
    } else if (this.robot.y === 187.5 && (this.levelHeight - this.origin[1]) > (this.BLOCK_LENGTH * 6)) {
      ghostOrigin[1] += this.robot.speed * modifier;
    } else if (this.robot.y > 187.5 && (this.levelHeight - this.origin[1]) > (this.BLOCK_LENGTH * 6)) {
      ghostPos[1] = 187.5;
      ghostOrigin[1] += this.robot.speed * modifier;
    } else {
      ghostPos[1] += this.robot.speed * modifier;
    }
    this.setGhostToReal(ghostPos, ghostOrigin);
  } else if (38 in this.keysDown) { //up
    if (this.origin[1] < 0) {
      ghostOrigin[1] = 0;
    } else if (this.robot.y === 187.5 && this.origin[1] > 0) {
      ghostOrigin[1] -= this.robot.speed * modifier;
    } else if (this.robot.y < 187.5 && this.origin[1] > 0) {
      ghostPos[1] = 187.5;
      ghostOrigin[1] -= this.robot.speed * modifier;
    } else {
      ghostPos[1] -= this.robot.speed * modifier;
    }
    this.setGhostToReal(ghostPos, ghostOrigin);
  }
  var coords = document.getElementById("coords");
  coords.innerHTML = "x: " + this.getRealX([this.robot.x, this.robot.y], this.origin);
};

Game.prototype.setGhostToReal = function (ghostPos, ghostOrigin) {
  this.robot.x = ghostPos[0];
  this.robot.y = ghostPos[1];
  this.origin = ghostOrigin;
}

Game.prototype.getColumn = function (robotPos, origin) {
  var xInLevel = this.getRealX(robotPos, origin);
  var column = Math.floor(xInLevel / this.BLOCK_LENGTH);
  return column;
}

Game.prototype.getRealX = function (pos, origin) {
  return pos[0] + origin[0];
}

document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext("2d");
  var renderer = new Renderer(context);
  gameInstance = new Game(renderer);
  renderer.game = gameInstance;

  addEventListener("keydown", function (e) {
    gameInstance.keysDown[e.keyCode] = true;
    // console.log(keysDown);
  }, false);

  addEventListener("keyup", function (e) {
    delete gameInstance.keysDown[e.keyCode];
    // console.log(keysDown);
  }, false);

  gameInstance.main(Date.now());
});
