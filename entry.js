var Renderer = require('./renderer.js')
var Robot = require('./robot.js')

function Game(renderer) {
  this.renderer = renderer;
  this.BLOCK_LENGTH = 75;
  var level1 = require('./levels/level1.js');
  this.levelSequence = [level1];
  this.origin = [0,0]
  this.keysDown = {};
}

Game.prototype.startLevel = function (level) {
  this.currentLevel = level;
  this.levelWidth = this.currentLevel.backgroundGrid[0].length * this.BLOCK_LENGTH;
  this.levelHeight = this.currentLevel.backgroundGrid.length * this.BLOCK_LENGTH;

  if (this.currentLevel.backgroundGrid.length !== this.currentLevel.foregroundGrid.length ||
    this.currentLevel.backgroundGrid[0].length !== this.currentLevel.foregroundGrid[0].length) {
      throw "foregroundGrid and backgroundGrid dimensions don't match!"
  }

  //fix this later - a starting robot might not be positioned in the middle of the screen
  this.origin[0] = this.currentLevel.startingPos[0] - 263.5;
  this.origin[1] = this.currentLevel.startingPos[1] - 187.5;
  this.robot = new Robot([263.5, 187.5]);

  this.status = "inControl"
  this.main(Date.now());
};

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
  var realArrays = [this.origin, this.robot.pos]
  var topRow = this.getTopRow(realArrays);
  var bottomRow = this.getBottomRow(realArrays);
  var leftCol = this.getLeftColumn(realArrays);
  var rightCol = this.getRightColumn(realArrays);
  var ghostArrays = [this.origin, this.robot.pos];

  if (this.status === "inControl") {

    if (38 in this.keysDown) { //up
      var belowRow = bottomRow + 1;
      if (leftCol === rightCol) {
        for (var el = 0; el < this.currentLevel.elevators.length; el++) {
          if (this.currentLevel.elevators[el].col === leftCol) {
            this.rideElevator([this.currentLevel.elevators[el]], 0);
          }
        }
      } else {
        for (var el = 0; el < this.currentLevel.elevators.length; el++) {
          if (this.currentLevel.elevators[el].col === leftCol) {
            for (var el2 = 0; el2 < this.currentLevel.elevators.length; el2++) {
              if (
                this.currentLevel.elevators[el2] !== this.currentLevel.elevators[el] &&
                this.currentLevel.elevators[el2].col === rightCol
              ) {
                this.rideElevator([
                  this.currentLevel.elevators[el],
                  this.currentLevel.elevators[el2]
                ], 0);
              }
            }
          }
        }
      }
    }

    if (39 in this.keysDown) { //right
      ghostArrays = this.moveRight(this.robot.speed, modifier);
      ghostCol = this.getRightColumn(ghostArrays)
      if (this.passThrough(this.currentLevel.foregroundGrid[topRow][ghostCol]) === false ||
      this.passThrough(this.currentLevel.foregroundGrid[bottomRow][ghostCol]) === false) {
        robotX = this.getRealRightX(realArrays);
        edge = 0.5 + (ghostCol * this.BLOCK_LENGTH) - 1;
        difference = edge - robotX;
        ghostArrays = this.moveRight(difference, 1);
      }
    } else if (37 in this.keysDown) { //left
      ghostArrays = this.moveLeft(this.robot.speed, modifier);
      ghostCol = this.getLeftColumn(ghostArrays)
      if (this.passThrough(this.currentLevel.foregroundGrid[topRow][ghostCol]) === false ||
      this.passThrough(this.currentLevel.foregroundGrid[bottomRow][ghostCol]) === false) {
        robotX = this.getRealLeftX(realArrays);
        edge = 0.5 + ((ghostCol + 1) * this.BLOCK_LENGTH);
        difference = robotX - edge;
        ghostArrays = this.moveLeft(difference, 1);
      }
    }

    // if (40 in this.keysDown) { //down
    //   ghostArrays = this.moveDown(this.robot.speed, modifier);
    //   ghostRow = this.getBottomRow(ghostArrays)
    //   if (this.passThrough(this.currentLevel.foregroundGrid[ghostRow][leftCol]) === false ||
    //       this.passThrough(this.currentLevel.foregroundGrid[ghostRow][rightCol]) === false) {
    //     robotY = this.getRealBottomY(realArrays);
    //     edge = 0.5 + (ghostRow * this.BLOCK_LENGTH) - 1;
    //     difference = edge - robotY;
    //     ghostArrays = this.moveDown(difference, 1);
    //   }
    // } else if (38 in this.keysDown) { //up
    //   ghostArrays = this.moveUp(this.robot.speed, modifier);
    //   ghostRow = this.getTopRow(ghostArrays)
    //   if (this.passThrough(this.currentLevel.foregroundGrid[ghostRow][leftCol]) === false ||
    //       this.passThrough(this.currentLevel.foregroundGrid[ghostRow][rightCol]) === false) {
    //     robotY = this.getRealTopY(realArrays);
    //     edge = 0.5 + ((ghostRow + 1) * this.BLOCK_LENGTH);
    //     difference = robotY - edge;
    //     ghostArrays = this.moveUp(difference, 1);
    //   }
    // }
  } else if (this.status === "rising") {
    ghostArrays = this.moveUp(this.robot.speed, modifier);
  }

  this.setGhostToReal(ghostArrays);
  this.updateDebugHTML(realArrays);
  this.checkElevator();
};

Game.prototype.checkElevator = function () {
  if (this.status === "rising") {
    console.log(this.stopAt);
    console.log(this.getRealTopY([this.origin, this.robot.pos]));
    if (this.getRealBottomY([this.origin, this.robot.pos]) <= this.stopAt) {
      this.status = "inControl";
    }
  }
};

Game.prototype.rideElevator = function (elevatorArray, stopAt) {
  this.status = "rising";
  this.stopAt = stopAt;
};

Game.prototype.passThrough = function (object) {
  if (
    object === "block" ||
    object === "platform" ||
    object.toString() === "door" && object.status === "closed"
  ) {
    return false;
  } else {
    return true;
  }
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

Game.prototype.getLeftColumn = function (arrays) {
  var xInLevel = this.getRealLeftX(arrays);
  var column = Math.floor(xInLevel / this.BLOCK_LENGTH);
  return column;
}

Game.prototype.getRightColumn = function (arrays) {
  var xInLevel = this.getRealRightX(arrays);
  var column = Math.floor(xInLevel / this.BLOCK_LENGTH);
  return column;
}

Game.prototype.getTopRow = function (arrays) {
  var yInLevel = this.getRealTopY(arrays);
  var row = Math.floor(yInLevel / this.BLOCK_LENGTH);
  return row;
}

Game.prototype.getBottomRow = function (arrays) {
  var yInLevel = this.getRealBottomY(arrays);
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

Game.prototype.updateDebugHTML = function (realArrays) {
  var leftLi = document.getElementById("left");
  leftLi.innerHTML = "LEFT:<br>" + this.getRealLeftX(realArrays) + "<br>"
                    + "col: " + this.getLeftColumn(realArrays);
  var rightLi = document.getElementById("right");
  rightLi.innerHTML = "RIGHT:<br>" + this.getRealRightX(realArrays) + "<br>"
                    + "col: " + this.getRightColumn(realArrays);
  var topLi = document.getElementById("top");
  topLi.innerHTML = "TOP:<br>" + this.getRealTopY(realArrays) + "<br>"
                    + "row: " + this.getTopRow(realArrays);
  var bottomLi = document.getElementById("bottom");
  bottomLi.innerHTML = "BOTTOM:<br>" + this.getRealBottomY(realArrays) + "<br>"
                    + "row: " + this.getBottomRow(realArrays);
};

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

  gameInstance.startLevel(gameInstance.levelSequence[0]);
});
