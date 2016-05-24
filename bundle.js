/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Renderer = __webpack_require__(3)
	var Robot = __webpack_require__(4)
	const BLOCK_LENGTH = 75;

	function Game(renderer) {
	  this.renderer = renderer;
	  this.BLOCK_LENGTH = 75;
	  var level1 = __webpack_require__(5);
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

	  if (this.status === "rising") {

	    ghostArrays = this.moveUp(this.robot.speed, modifier);
	    this.elevatorArray.forEach(function (elevator)
	    {elevator.height += (this.robot.speed * modifier);}.bind(this))

	  } else if (this.status === "inControl") {

	    this.checkUpKey(leftCol, rightCol, bottomRow);
	    //checkDownKey

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
	  }

	  this.setGhostToReal(ghostArrays);
	  this.updateDebugHTML(realArrays);
	  if (this.status === "rising") {
	    this.checkElevator();
	  }
	};

	Game.prototype.checkElevator = function () {
	  if (this.status === "rising") {
	    var realRobotBottom = this.getRealBottomY([this.origin, this.robot.pos])
	    if (realRobotBottom === this.stopAt) {
	      this.status = "inControl";
	    } else if (realRobotBottom < this.stopAt) {
	      var difference = this.stopAt - realRobotBottom
	      this.moveDown(difference, 1);
	      this.elevatorArray.forEach(function (elevator)
	      {elevator.height -= (difference);}.bind(this))
	      this.status = "inControl";
	    }
	  }
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

	Game.prototype.checkUpKey = function (leftCol, rightCol, bottomRow) {
	  if (38 in this.keysDown) { //up
	    var belowRow = bottomRow + 1;
	    if (leftCol === rightCol) {
	      for (var el = 0; el < this.currentLevel.elevators.length; el++) {
	        if (this.currentLevel.elevators[el].col === leftCol) {
	          this.launchElevator([this.currentLevel.elevators[el]], "up");
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
	              this.launchElevator([
	                this.currentLevel.elevators[el],
	                this.currentLevel.elevators[el2]
	              ], "up");
	              return 1;
	            }
	          }
	        }
	      }
	    }
	  }
	};

	Game.prototype.launchElevator = function (elevatorArray, dir) {
	  this.elevatorArray = elevatorArray;
	  var blockHeightIndex = elevatorArray[0].heights.indexOf(elevatorArray[0].blocksHigh)
	  var destinationRow, stopAt

	  if (dir === "up") {
	    destinationRow = elevatorArray[0].baseRow - elevatorArray[0].heights[blockHeightIndex + 1]
	    stopAt = 0 + (BLOCK_LENGTH * destinationRow) - 0.5;
	    this.status = "rising";
	    this.stopAt = stopAt;
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

	  if (this.robot.pos[1] === 187.5 && this.origin[1] > 0) {
	    returnOrigin[1] -= pixels * modifier;
	  } else if (this.robot.pos[1] < 187.5 && this.origin[1] > 0) {
	    returnPos[1] = 187.5;
	    returnOrigin[1] -= pixels * modifier;
	  } else {
	    returnPos[1] -= pixels * modifier;
	  }

	  if (returnOrigin[1] < 0) {
	    var difference = 0 - returnOrigin[1]
	    returnOrigin[1] = 0;
	    returnPos[1] -= difference;
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


/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	const BLOCK_LENGTH = 75;

	function Renderer(context, game) {
	  this.c = context;
	  this.game = game;
	}

	Renderer.prototype.renderScreen = function () {
	  var cornerSquares = this.getVisibleSquares(this.game.origin, this.game.currentLevel);
	  this.renderBackground(this.game.origin, this.game.currentLevel, cornerSquares);
	  this.renderForeground(this.game.origin, this.game.currentLevel, cornerSquares);
	  this.renderElevators(this.game.origin, this.game.currentLevel, cornerSquares);
	  this.renderRobot(this.game.robot);
	}

	Renderer.prototype.getVisibleSquares = function (origin, currentLevel) {
	  var topRow = Math.floor(origin[1] / BLOCK_LENGTH);
	  if (topRow === -1) { topRow = 0 };
	  var bottomRow = Math.floor((origin[1] + (BLOCK_LENGTH * 6) - 1) / BLOCK_LENGTH);
	  if (bottomRow >= this.game.currentLevel.foregroundGrid.length) { bottomRow = this.game.currentLevel.foregroundGrid.length - 1 }
	  var leftCol = Math.floor(origin[0] / BLOCK_LENGTH);
	  if (leftCol === -1) { leftCol = 0 };
	  var rightCol = Math.floor((origin[0] + (BLOCK_LENGTH * 8) - 1) / BLOCK_LENGTH);
	  if (rightCol >= this.game.currentLevel.foregroundGrid[0].length) { rightCol = this.game.currentLevel.foregroundGrid[0].length - 1 }

	  return [topRow, leftCol, bottomRow, rightCol];
	};

	Renderer.prototype.renderForeground = function (origin, currentLevel, cornerSquares) {
	  var el = document.getElementById("coord-window");
	  el.innerHTML = "LEFT: " + cornerSquares[1] + "<br>"
	                + "TOP: " + cornerSquares[0] + "<br>"
	                + "RIGHT: " + cornerSquares[3] + "<br>"
	                + "BOTTOM: " + cornerSquares[2];

	  var row_top_y = cornerSquares[0] * BLOCK_LENGTH;
	  for (var row = cornerSquares[0]; row <= cornerSquares[2]; row++) {
	    var col_left_x = cornerSquares[1] * BLOCK_LENGTH;
	    for (var col = cornerSquares[1]; col <= cornerSquares[3]; col++) {

	      var x_block = (-1 * origin[0]) + col_left_x + 0.5;
	      var y_block = (-1 * origin[1]) + row_top_y + 0.5;

	      if (currentLevel.foregroundGrid[row][col] === "block") {
	        this.drawBlock([x_block, y_block]);
	      } else if (currentLevel.foregroundGrid[row][col] === "platform") {
	        this.drawPlatform([x_block, y_block], '#67480E', '#211704');
	      } else if (currentLevel.foregroundGrid[row][col].toString() === "door") {
	        this.drawDoor(currentLevel.foregroundGrid[row][col],[x_block, y_block])
	      }

	      col_left_x += 75;
	    }

	    row_top_y += 75;
	  }
	}

	Renderer.prototype.renderBackground = function (origin, currentLevel, cornerSquares) {
	  var row_top_y = cornerSquares[0] * BLOCK_LENGTH;
	  for (var row = cornerSquares[0]; row <= cornerSquares[2]; row++) {
	    var col_left_x = cornerSquares[1] * BLOCK_LENGTH;
	    for (var col = cornerSquares[1]; col <= cornerSquares[3]; col++) {

	      //skip if there's a foreground block covering this square
	      if (currentLevel.foregroundGrid[row][col] === "block") {
	        col_left_x += 75;
	        continue;
	      }

	      var x_block = (-1 * origin[0]) + col_left_x + 0.5;
	      var y_block = (-1 * origin[1]) + row_top_y + 0.5;

	      if(currentLevel.backgroundGrid[row][col] === "brick"){
	        var leftEdges = currentLevel.foregroundGrid[row][col - 1] !== "block"
	        this.drawBrick([x_block, y_block], '#632612', leftEdges);
	      }

	      col_left_x += 75;
	    }

	    row_top_y += 75;
	  }
	}

	Renderer.prototype.renderElevators = function (origin, currentLevel, cornerSquares) {
	  var col_left_x = cornerSquares[1] * BLOCK_LENGTH;
	  //iterate through each visible column:
	  for (var col = cornerSquares[1]; col <= cornerSquares[3]; col++) {
	    //iterate through elevators to see if there's one in this column:
	    for (var elv = 0; elv < currentLevel.elevators.length; elv++) {
	      if (currentLevel.elevators[elv].col === col) {
	        //if so, find where the top is:
	        var topRow = currentLevel.elevators[elv].topRow;
	        var height = currentLevel.elevators[elv].height;

	        var platform_top_y = (BLOCK_LENGTH * topRow) - origin[1] + 0.5;
	        var x_block = (-1 * origin[0]) + col_left_x + 0.5;
	        this.drawPlatform([x_block, platform_top_y - height], '#67480E', '#211705');
	        // this.drawPlatform([x_block, 0], '#67480E', '#211704');
	      }


	      // var row_top_y = 0;
	      // for (var row = 0; row < currentLevel.foregroundGrid.length; row++) {
	      //   var col_left_x = 0
	      //   for (var col = 0; col < currentLevel.foregroundGrid[0].length; col++) {
	      //     var x_block = (-1 * origin[0]) + col_left_x + 0.5;
	      //     var y_block = (-1 * origin[1]) + row_top_y + 0.5;
	      //
	      //     //draw the top:
	      //     if (topRow === row && baseCol === col) {
	      //       this.drawPlatform([x_block, y_block - height], '#67480E', '#211704');
	      //     }
	      //
	      //     col_left_x += 75;
	      //   }
	      //
	      //   row_top_y += 75;
	      // }
	    }

	    col_left_x += 75;
	  }
	};

	Renderer.prototype.renderRobot = function (robot) {
	  this.drawOuterSquare(robot.pos, 'red');
	}

	Renderer.prototype.drawDoor = function (door, pos) {
	  var x = pos[0];
	  var y = pos[1];
	  var width = Math.floor(BLOCK_LENGTH / 3);

	  var topLeftCorner;
	  var topRightCorner;
	  var bottomRightCorner;
	  var bottomLeftCorner;

	  if (door.side === "right") {
	    topLeftCorner = [x + BLOCK_LENGTH - 1 - width, y];
	    topRightCorner = [x + BLOCK_LENGTH - 1, y];
	    bottomRightCorner = [x + BLOCK_LENGTH - 1, y + BLOCK_LENGTH - 1];
	    bottomLeftCorner = [x + BLOCK_LENGTH - 1 - width, y + BLOCK_LENGTH - 1];
	  } else {
	    topLeftCorner = [x, y];
	    topRightCorner = [x + width, y];
	    bottomRightCorner = [x + width, y + BLOCK_LENGTH - 1];
	    bottomLeftCorner = [x, y + BLOCK_LENGTH - 1];
	  }

	  this.c.fillStyle = '#fff';
	  this.c.fillRect(topLeftCorner[0], topLeftCorner[1], width, BLOCK_LENGTH - 1);

	  this.c.strokeStyle = '#000';
	  this.drawLine(topLeftCorner, topRightCorner);
	  this.drawLine(topRightCorner, bottomRightCorner);
	  this.drawLine(bottomRightCorner, bottomLeftCorner);
	  this.drawLine(bottomLeftCorner, topLeftCorner);
	};

	Renderer.prototype.drawPlatform = function (pos, topColor, bottomColor) {
	  var x = pos[0];
	  var y = pos[1];
	  var height = Math.floor(BLOCK_LENGTH/3);
	  var grad = this.c.createLinearGradient(x, y, x, y + height);
	  grad.addColorStop(0, topColor);
	  grad.addColorStop(1, bottomColor);

	  this.c.beginPath();
	  this.c.rect(x, y, BLOCK_LENGTH - 1, height)
	  this.c.fillStyle = grad;
	  this.c.fill();
	  this.c.strokeStyle = '#000';
	  this.c.stroke();
	};

	Renderer.prototype.drawBrick = function (pos, color, leftEdges) {
	  var x = pos[0];
	  var y = pos[1];
	  var rowHeight = (BLOCK_LENGTH / 4);
	  this.drawOuterSquare(pos, color, color);
	  this.c.strokeStyle = '#000';
	  for (var i = 0; i < 4; i++) {
	    var thisRowY = Math.floor(y + (rowHeight * i)) + 0.5;
	    this.drawLine([x, thisRowY], [x + BLOCK_LENGTH - 0.5, thisRowY]);
	    if (i % 2 == 0) {
	      if (leftEdges === true) {
	        this.drawLine([x, thisRowY], [x, thisRowY + rowHeight - 0.5]);
	      }
	      this.drawLine(
	        [x + (BLOCK_LENGTH / 2) + 0.5, thisRowY],
	        [x + (BLOCK_LENGTH / 2) + 0.5, thisRowY + rowHeight - 0.5]
	      );
	    } else {
	      this.drawLine(
	        [Math.floor(x + (BLOCK_LENGTH / 4)) + 0.5, thisRowY],
	        [Math.floor(x + (BLOCK_LENGTH / 4)) + 0.5, thisRowY + rowHeight - 0.5]
	      );
	      this.drawLine(
	        [Math.floor(x + (BLOCK_LENGTH / 4) * 3) + 0.5, thisRowY],
	        [Math.floor(x + (BLOCK_LENGTH / 4) * 3) + 0.5, thisRowY + rowHeight - 0.5]
	      );
	    }
	  }
	}

	Renderer.prototype.drawBlock = function (pos) {
	  var x = pos[0];
	  var y = pos[1];
	  var frontGrad = this.c.createLinearGradient(x, y, x, y + 75);
	  frontGrad.addColorStop(0, '#2c2929');
	  frontGrad.addColorStop(1, '#161515');
	  var backGrad = this.c.createLinearGradient(x, y, x, y + 75);
	  backGrad.addColorStop(0, '#292626');
	  backGrad.addColorStop(1, '#000000');

	  this.drawOuterSquare(pos, '#000', frontGrad);

	  const EDGE_TO_INNER = 8;
	  const TRI_LENGTH = 40;
	  const INNER_RECT_LENGTH = BLOCK_LENGTH - (EDGE_TO_INNER * 2);
	  const START_TRIANGLE = EDGE_TO_INNER + ((INNER_RECT_LENGTH - TRI_LENGTH) / 2);

	  //left triangle
	  this.c.fillStyle = backGrad;
	  this.c.beginPath();
	  this.c.moveTo(x + EDGE_TO_INNER, y + START_TRIANGLE);
	  this.c.lineTo(x + EDGE_TO_INNER, y + START_TRIANGLE + TRI_LENGTH);
	  this.c.lineTo(x + EDGE_TO_INNER + (TRI_LENGTH / 2), y + START_TRIANGLE + (TRI_LENGTH / 2));
	  this.c.closePath();
	  this.c.fill();
	  this.c.stroke();

	  //top triangle
	  this.c.beginPath();
	  this.c.moveTo(x + START_TRIANGLE, y + EDGE_TO_INNER);
	  this.c.lineTo(x + START_TRIANGLE + TRI_LENGTH, y + EDGE_TO_INNER);
	  this.c.lineTo(x + START_TRIANGLE + (TRI_LENGTH / 2), y + EDGE_TO_INNER + (TRI_LENGTH / 2));
	  this.c.closePath();
	  this.c.fill();
	  this.c.stroke();

	  //right triangle
	  this.c.beginPath();
	  this.c.moveTo(x + BLOCK_LENGTH - EDGE_TO_INNER, y + START_TRIANGLE);
	  this.c.lineTo(x + BLOCK_LENGTH - EDGE_TO_INNER, y + START_TRIANGLE + TRI_LENGTH);
	  this.c.lineTo(x + BLOCK_LENGTH - EDGE_TO_INNER - (TRI_LENGTH / 2), y + START_TRIANGLE + (TRI_LENGTH / 2));
	  this.c.closePath();
	  this.c.fill();
	  this.c.stroke();

	  //bottom triangle
	  this.c.beginPath();
	  this.c.moveTo(x + START_TRIANGLE, y + BLOCK_LENGTH - EDGE_TO_INNER);
	  this.c.lineTo(x + START_TRIANGLE + TRI_LENGTH, y + BLOCK_LENGTH - EDGE_TO_INNER);
	  this.c.lineTo(x + START_TRIANGLE + (TRI_LENGTH / 2), y + BLOCK_LENGTH - EDGE_TO_INNER - (TRI_LENGTH / 2));
	  this.c.closePath();
	  this.c.fill();
	  this.c.stroke();
	}

	Renderer.prototype.drawOuterSquare = function (pos, stroke, fill) {
	  var x = pos[0];
	  var y = pos[1];
	  this.c.beginPath();
	  this.c.moveTo(x, y);
	  this.c.lineTo(x + BLOCK_LENGTH - 1, y);
	  this.c.lineTo(x + BLOCK_LENGTH - 1, y + BLOCK_LENGTH - 1);
	  this.c.lineTo(x, y + BLOCK_LENGTH - 1);
	  this.c.closePath();
	  this.c.strokeStyle = stroke;
	  this.c.lineWidth = 1;
	  if(fill != undefined){
	    this.c.fillStyle = fill;
	    this.c.fill();
	  }
	  this.c.stroke();
	}

	Renderer.prototype.drawLine = function (start, finish) {
	  this.c.beginPath();
	  this.c.moveTo(start[0], start[1]);
	  this.c.lineTo(finish[0], finish[1]);
	  this.c.lineWidth = 1;
	  this.c.stroke();
	}

	module.exports = Renderer;


/***/ },
/* 4 */
/***/ function(module, exports) {

	function Robot(startingPos) {
	  this.pos = startingPos;
	  this.speed = 256;
	};

	module.exports = Robot;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var obj = __webpack_require__(8);
	var Level = obj.Level;
	var LevelBuilder = obj.LevelBuilder;
	var Door = obj.Door;
	var Elevator = obj.Elevator;

	var builder = new LevelBuilder();
	var doors = [
	  new Door(101, "right"),
	  new Door(102, "left")
	];
	var elevators = [
	  new Elevator({
	    id: 101,
	    baseRowCol: [10, 5],
	    startingHeight: 4,
	    heights: [4, 8]
	  }),
	  new Elevator({
	    id: 101,
	    baseRowCol: [10, 6],
	    startingHeight: 4,
	    heights: [4, 6]
	  }),
	];

	var foregroundGrid = [
	  builder.rowOf(24, "block"),
	  ["block"].concat(builder.rowOf(2, "")).concat(doors[0]).concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(6, "")).concat(["block"]).concat(builder.rowOf(5, "")).concat(doors[1]).concat(builder.rowOf(2, "")).concat(["block"]),
	  builder.rowOf(5, "block").concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(6, "")).concat(builder.rowOf(3, "platform")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
	  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(12, "")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
	  ["block"].concat([""]).concat(builder.rowOf(3, "block")).concat(builder.rowOf(14, "")).concat(builder.rowOf(5, "block")),
	  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(18, "")).concat(["block"]),
	  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(10, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
	  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(8, "block")).concat(builder.rowOf(6, "")).concat(["block"]),
	  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(8, "block")).concat(builder.rowOf(6, "")).concat(["block"]),
	  ["block"].concat(builder.rowOf(4, "")).concat(builder.rowOf(4, "")).concat(builder.rowOf(8, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
	  builder.rowOf(5, "block").concat(builder.rowOf(2, elevators[0])).concat(builder.rowOf(10, "block")).concat(builder.rowOf(6, "")).concat(["block"]),
	  builder.rowOf(17, "block").concat(builder.rowOf(6, "")).concat(["block"]),
	  builder.rowOf(24, "block")
	];

	var backgroundGrid = [
	  builder.rowOf(24, "brick"),
	  builder.rowOf(24, "brick"),
	  builder.rowOf(24, "brick"),
	  builder.rowOf(24, "brick"),
	  builder.rowOf(24, "brick"),
	  builder.rowOf(24, "brick"),
	  builder.rowOf(24, "brick"),
	  builder.rowOf(24, "brick"),
	  builder.rowOf(24, "brick"),
	  builder.rowOf(24, "brick"),
	  builder.rowOf(24, "brick"),
	  builder.rowOf(24, "brick"),
	  builder.rowOf(24, "brick")
	];

	level1 = new Level("Level 1", foregroundGrid, backgroundGrid, [938, 375.5], elevators);

	module.exports = level1;


/***/ },
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Door = __webpack_require__(9)
	var Elevator = __webpack_require__(10)

	function Level(name, foregroundGrid, backgroundGrid, robotPos, elevators) {
	  this.name = name;
	  this.foregroundGrid = foregroundGrid;
	  this.backgroundGrid = backgroundGrid;
	  this.startingPos = robotPos;
	  this.elevators = elevators;
	}

	function LevelBuilder() {};

	LevelBuilder.prototype.rowOf = function (rowLength, something) {
	  var rowArray = [];
	  for (var i = 0; i < rowLength; i++) {
	    rowArray.push(something);
	  }
	  return rowArray;
	};

	module.exports = {
	  Level: Level,
	  LevelBuilder: LevelBuilder,
	  Door: Door,
	  Elevator: Elevator
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	function Door(id, side) {
	  this.toString = function () { return "door" };
	  this.id = id;
	  this.status = "closed";
	  this.aniFrame = undefined;
	  this.side = side;
	};

	module.exports = Door;


/***/ },
/* 10 */
/***/ function(module, exports) {

	function Elevator(options) {
	  this.id = options.id;
	  this.col = options.baseRowCol[1];
	  this.baseRow = options.baseRowCol[0];
	  this.blocksHigh = options.startingHeight || 0;
	  this.speed = options.speed || 256;
	  this.heights = options.heights;

	  this.topRow = this.baseRow - this.blocksHigh;
	  this.height = 0;
	  this.toString = function () { return "elevator" };
	}

	module.exports = Elevator;


/***/ }
/******/ ]);