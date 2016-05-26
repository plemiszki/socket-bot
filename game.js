var Robot = require('./robot.js')
var Renderer = require('./renderer.js')
const BLOCK_LENGTH = 75;

function Game(renderer) {
  this.renderer = renderer;
  this.BLOCK_LENGTH = 75;
  var level1 = require('./levels/level1.js');
  this.levelSequence = [level1];
  this.origin = [0,0]
  this.keysDown = {};
  this.renderCount = 0;
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

  if (this.status === "rising") {

    ghostArrays = this.moveUp(this.robot.speed, modifier);
    this.elevatorArray.forEach(function (elevator) {
      elevator.additionalPixels += (this.robot.speed * modifier);
    }.bind(this))

  } else if (this.status === "descending") {

    ghostArrays = this.moveDown(this.robot.speed, modifier);
    this.elevatorArray.forEach(function (elevator) {
      elevator.additionalPixels -= (this.robot.speed * modifier);
    }.bind(this))

  } else if (this.status === "inControl") {

    if (38 in this.keysDown) { //up
      this.handleVerticalKeys(leftCol, rightCol, bottomRow, "up");
    } else if (40 in this.keysDown) { //down
      this.handleVerticalKeys(leftCol, rightCol, bottomRow, "down");
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
  }

  this.setGhostToReal(ghostArrays);
  this.updateDebugHTML(realArrays);
  if (this.status === "rising" || this.status === "descending") {
    this.checkElevator();
  }
};

Game.prototype.passThrough = function (object) {
  if ( object === "block" || object === "platform"
      || object.toString() === "door" && object.status === "closed"
  ) {
    return false;
  } else {
    return true;
  }
};

Game.prototype.handleVerticalKeys = function (leftCol, rightCol, bottomRow, key) {
  var elevators = this.currentLevel.elevators;
  var belowRow = bottomRow + 1;
  if (leftCol === rightCol) {
    var elevatorsToLaunch = [];
    for (var el = 0; el < elevators.length; el++) {
      if (elevators[el].col === leftCol) {
        elevatorsToLaunch.push(elevators[el])
        for (var j = 0; j < elevators.length; j++) {
          if (j !== el && elevators[j].id === elevators[el].id) {
            elevatorsToLaunch.push(elevators[j])
          }
        }
        this.launchElevatorMaybe(elevatorsToLaunch, key);
        break;
      }
    }
  } else {
    for (var el = 0; el < elevators.length; el++) {
      if (elevators[el].col === leftCol) {
        for (var el2 = 0; el2 < elevators.length; el2++) {
          if (elevators[el2] !== elevators[el] && elevators[el2].col === rightCol) {
            this.launchElevatorMaybe([elevators[el], elevators[el2]], key);
            return;
          }
        }
      }
    }
  }
};

Game.prototype.launchElevatorMaybe = function (elevatorArray, dir) {
  this.elevatorArray = elevatorArray;
  var blockHeightIndex = elevatorArray[0].heights.indexOf(elevatorArray[0].blocksHigh)
  var destinationRow, stopAt

  if (dir === "up") {
    if (this.endOfElevator(elevatorArray, dir, blockHeightIndex) === false) {
      this.newElevatorHeight = elevatorArray[0].heights[blockHeightIndex + 1];
      destinationRow = elevatorArray[0].baseRow - elevatorArray[0].heights[blockHeightIndex + 1]
      stopAt = 0 + (BLOCK_LENGTH * destinationRow) - 0.5;
      this.status = "rising";
      this.stopAt = stopAt;
    } else {
      console.log("top of Elevator!");
    }
  } else if (dir == "down") {
    if (this.endOfElevator(elevatorArray, dir, blockHeightIndex) === false) {
      this.newElevatorHeight = elevatorArray[0].heights[blockHeightIndex - 1];
      destinationRow = elevatorArray[0].baseRow - elevatorArray[0].heights[blockHeightIndex - 1]
      stopAt = 0 + (BLOCK_LENGTH * destinationRow) - 0.5;
      this.status = "descending";
      this.stopAt = stopAt;
    } else {
      console.log("bottom of Elevator!");
    }
  }
};

Game.prototype.endOfElevator = function (elevatorArray, dir, blockHeightIndex) {
  if (dir === "up") {
    return (blockHeightIndex + 1) === elevatorArray[0].heights.length
  } else if (dir === "down") {
    return blockHeightIndex === 0
  }
};

Game.prototype.checkElevator = function () {
  if (this.status === "rising") {
    var realRobotBottom = this.getRealBottomY([this.origin, this.robot.pos])
    if (realRobotBottom === this.stopAt) {
      this._afterElevatorInNewSpot();
    } else if (realRobotBottom < this.stopAt) {
      var difference = this.stopAt - realRobotBottom
      this.moveDown(difference, 1);
      this.elevatorArray.forEach(function (elevator) {
        elevator.additionalPixels -= (difference);
      }.bind(this))
      this._afterElevatorInNewSpot();
    }
  } else if (this.status === "descending") {
    var realRobotBottom = this.getRealBottomY([this.origin, this.robot.pos])
    if (realRobotBottom === this.stopAt) {
      this._afterElevatorInNewSpot();
    } else if (realRobotBottom > this.stopAt) {
      var difference = realRobotBottom - this.stopAt
      this.moveUp(difference, 1);
      this.elevatorArray.forEach(function (elevator) {
        elevator.additionalPixels += (difference);
      }.bind(this))
      this._afterElevatorInNewSpot();
    }
  }
};

Game.prototype._afterElevatorInNewSpot = function () {
  this.status = "inControl";
  var newElevatorHeight = this.newElevatorHeight;
  this.elevatorArray.forEach(function (elevator) {
    elevator.blocksHigh = newElevatorHeight;
    elevator.topRow = elevator.baseRow - elevator.blocksHigh;
    elevator.additionalPixels = 0;
  })
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
  var difference;

  if (this.robot.pos[1] === 187.5 && this.origin[1] > 0) {
    returnOrigin[1] -= pixels * modifier;
  } else if (this.robot.pos[1] < 187.5 && this.origin[1] > 0) {
    difference = 187.5 - this.robot.pos[1];
    returnOrigin[1] -= pixels * modifier;
    returnPos[1] = 187.5;
    returnOrigin[1] -= difference;
  } else {
    returnPos[1] -= pixels * modifier;
  }

  if (returnOrigin[1] < 0) { //has the view passed the top of the level?
    var difference = 0 - returnOrigin[1] //by how much?
    returnOrigin[1] = 0; //set the view back to 0
    returnPos[1] -= difference; //push the robot down by the same amount
  }

  return [returnOrigin, returnPos];
};

Game.prototype.moveDown = function (pixels, modifier) {
  var returnOrigin = this.origin;
  var returnPos = this.robot.pos;
  var difference;

  if (this.robot.pos[1] === 187.5 && (this.levelHeight - this.origin[1]) > (this.BLOCK_LENGTH * 6)) {
    returnOrigin[1] += pixels * modifier;
  } else if (this.robot.pos[1] > 187.5 && (this.levelHeight - this.origin[1]) > (this.BLOCK_LENGTH * 6)) {
    difference = this.robot.pos[1] - 187.5;
    returnOrigin[1] += pixels * modifier;
    returnPos[1] = 187.5;
    returnOrigin[1] += difference;
  } else {
    returnPos[1] += pixels * modifier;
  }

  var topOfScreenToLevelBottom = this.levelHeight - returnOrigin[1];
  if (topOfScreenToLevelBottom < this.BLOCK_LENGTH * 6) {
    difference = (this.BLOCK_LENGTH * 6) - topOfScreenToLevelBottom;
    returnOrigin[1] = this.levelHeight - (this.BLOCK_LENGTH * 6);
    returnPos[1] += difference;
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

module.exports = Game;
