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

Game.prototype.update = function (modifier) {
  var ghostArrays = [this.origin, this.robot.pos];
  var ghostPos = this.robot.pos;
  var ghostOrigin = this.origin;
  var row = this.getTopRow(this.robot.pos, this.origin);
  var col = this.getLeftColumn(this.robot.pos, this.origin);

  if (39 in this.keysDown) { //right
    ghostArrays = this.moveRight(this.robot.speed, modifier);
    ghostOrigin = ghostArrays[0];
    ghostPos = ghostArrays[1];
    ghostCol = this.getRightColumn(ghostPos, ghostOrigin)
    if (this.currentLevel.foregroundGrid[row][ghostCol] == "block") {
      robotX = this.getRealRightX([this.origin, this.robot.pos]);
      edge = 0.5 + (ghostCol * this.BLOCK_LENGTH) - 1;
      difference = edge - robotX;
      ghostArrays = this.moveRight(difference, 1);
    }
  } else if (37 in this.keysDown) { //left
    ghostArrays = this.moveLeft(this.robot.speed, modifier);
    ghostOrigin = ghostArrays[0];
    ghostPos = ghostArrays[1];
    ghostCol = this.getLeftColumn(ghostPos, ghostOrigin)
    if (this.currentLevel.foregroundGrid[row][ghostCol] == "block") {
      robotX = this.getRealLeftX([this.origin, this.robot.pos]);
      edge = 0.5 + ((ghostCol + 1) * this.BLOCK_LENGTH);
      difference = robotX - edge;
      ghostArrays = this.moveLeft(difference, 1);
    }
  }
  if (40 in this.keysDown) { //down
    ghostArrays = this.moveDown(this.robot.speed, modifier);
    ghostOrigin = ghostArrays[0];
    ghostPos = ghostArrays[1];
    ghostRow = this.getBottomRow(ghostPos, ghostOrigin)
    if (this.currentLevel.foregroundGrid[ghostRow][col] == "block") {
      robotY = this.getRealBottomY([this.origin, this.robot.pos]);
      edge = 0.5 + (ghostRow * this.BLOCK_LENGTH) - 1;
      difference = edge - robotY;
      ghostArrays = this.moveDown(difference, 1);
    }
  } else if (38 in this.keysDown) { //up
    ghostArrays = this.moveUp(this.robot.speed, modifier);
    ghostOrigin = ghostArrays[0];
    ghostPos = ghostArrays[1];
    ghostRow = this.getTopRow(ghostPos, ghostOrigin)
    if (this.currentLevel.foregroundGrid[ghostRow][col] == "block") {
      robotY = this.getRealTopY([this.origin, this.robot.pos]);
      edge = 0.5 + ((ghostRow + 1) * this.BLOCK_LENGTH);
      difference = robotY - edge;
      ghostArrays = this.moveUp(difference, 1);
    }
  }

  this.setGhostToReal(ghostArrays);

  var leftLi = document.getElementById("left");
  leftLi.innerHTML = "LEFT:<br>"
                    + this.getRealLeftX([this.origin, this.robot.pos]) + "<br>"
                    + "col: " + this.getLeftColumn(this.robot.pos, this.origin);
  var rightLi = document.getElementById("right");
  rightLi.innerHTML = "RIGHT:<br>"
                    + this.getRealRightX([this.origin, this.robot.pos]) + "<br>"
                    + "col: " + this.getRightColumn(this.robot.pos, this.origin);
  var topLi = document.getElementById("top");
  topLi.innerHTML = "TOP:<br>"
                    + this.getRealTopY([this.origin, this.robot.pos]) + "<br>"
                    + "row: " + this.getTopRow(this.robot.pos, this.origin);
  var bottomLi = document.getElementById("bottom");
  bottomLi.innerHTML = "BOTTOM:<br>"
                    + this.getRealBottomY([this.origin, this.robot.pos]) + "<br>"
                    + "row: " + this.getBottomRow(this.robot.pos, this.origin);
};

Game.prototype.moveLeft = function (pixels, modifier) {
  var returnOrigin = this.origin;
  var returnPos = this.robot.pos;

  if (this.origin[0] < 0) {
    returnOrigin[0] = 0;
  } else if (this.robot.pos[0] === 263.5 && this.origin[0] > 0) {
    returnOrigin[0] -= pixels * modifier;
  } else if (this.robot.pos[0] < 263.5 && this.origin[0] > 0) {
    returnPos[0] = 263.5;
    returnOrigin[0] -= pixels * modifier;
  } else {
    returnPos[0] -= pixels * modifier;
  }
  return [returnOrigin, returnPos];
};

Game.prototype.moveRight = function (pixels, modifier) {
  var returnOrigin = this.origin;
  var returnPos = this.robot.pos;

  if (this.levelWidth - this.origin[0] < this.BLOCK_LENGTH * 8) {
    returnOrigin[0] = this.levelWidth - (this.BLOCK_LENGTH * 8);
  } else if (this.robot.pos[0] === 263.5 && (this.levelWidth - this.origin[0]) > (this.BLOCK_LENGTH * 8)) {
    returnOrigin[0] += pixels * modifier;
  } else if (this.robot.pos[0] > 263.5 && (this.levelWidth - this.origin[0]) > (this.BLOCK_LENGTH * 8)) {
    returnPos[0] = 263.5;
    returnOrigin[0] += pixels * modifier;
  } else {
    returnPos[0] += pixels * modifier;
  }
  return [returnOrigin, returnPos];
};

Game.prototype.moveUp = function (pixels, modifier) {
  var returnOrigin = this.origin;
  var returnPos = this.robot.pos;

  if (this.origin[1] < 0) {
    returnOrigin[1] = 0;
  } else if (this.robot.pos[1] === 187.5 && this.origin[1] > 0) {
    returnOrigin[1] -= pixels * modifier;
  } else if (this.robot.pos[1] < 187.5 && this.origin[1] > 0) {
    returnPos[1] = 187.5;
    returnOrigin[1] -= pixels * modifier;
  } else {
    returnPos[1] -= pixels * modifier;
  }
  return [returnOrigin, returnPos];
};

Game.prototype.moveDown = function (pixels, modifier) {
  var returnOrigin = this.origin;
  var returnPos = this.robot.pos;

  if (this.levelHeight - this.origin[1] < this.BLOCK_LENGTH * 6) {
    returnOrigin[1] = this.levelHeight - (this.BLOCK_LENGTH * 6);
  } else if (this.robot.pos[1] === 187.5 && (this.levelHeight - this.origin[1]) > (this.BLOCK_LENGTH * 6)) {
    returnOrigin[1] += pixels * modifier;
  } else if (this.robot.pos[1] > 187.5 && (this.levelHeight - this.origin[1]) > (this.BLOCK_LENGTH * 6)) {
    returnPos[1] = 187.5;
    returnOrigin[1] += pixels * modifier;
  } else {
    returnPos[1] += pixels * modifier;
  }
  return [returnOrigin, returnPos];
};

Game.prototype.setGhostToReal = function (ghostArrays) {
  this.origin = ghostArrays[0];
  this.robot.pos = ghostArrays[1];
}

Game.prototype.getLeftColumn = function (robotPos, origin) {
  var xInLevel = this.getRealLeftX([origin, robotPos]);
  var column = Math.floor(xInLevel / this.BLOCK_LENGTH);
  return column;
}

Game.prototype.getRightColumn = function (robotPos, origin) {
  var xInLevel = this.getRealRightX([origin, robotPos]);
  var column = Math.floor(xInLevel / this.BLOCK_LENGTH);
  return column;
}

Game.prototype.getTopRow = function (robotPos, origin) {
  var yInLevel = this.getRealTopY([origin, robotPos]);
  var row = Math.floor(yInLevel / this.BLOCK_LENGTH);
  return row;
}

Game.prototype.getBottomRow = function (robotPos, origin) {
  var yInLevel = this.getRealBottomY([origin, robotPos]);
  var row = Math.floor(yInLevel / this.BLOCK_LENGTH);
  return row;
}

Game.prototype.getRealLeftX = function (arrays) {
  return arrays[0][0] + arrays[1][0];
}

Game.prototype.getRealRightX = function (arrays) {
  return arrays[0][0] + (arrays[1][0] + this.BLOCK_LENGTH - 1);
}

Game.prototype.getRealTopY = function (arrays) {
  return arrays[0][1] + arrays[1][1];
}

Game.prototype.getRealBottomY = function (arrays) {
  return arrays[0][1] + (arrays[1][1] + this.BLOCK_LENGTH - 1);
}

document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext("2d");
  var renderer = new Renderer(context);
  gameInstance = new Game(renderer);
  renderer.game = gameInstance;

  window.addEventListener("keydown", function (e) {
    gameInstance.keysDown[e.keyCode] = true;
    // console.log(keysDown);
  }, false);

  window.addEventListener("keyup", function (e) {
    delete gameInstance.keysDown[e.keyCode];
    // console.log(keysDown);
  }, false);

  gameInstance.main(Date.now());
});
