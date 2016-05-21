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

	function Game(renderer) {
	  this.renderer = renderer;
	  this.levelSequence = [];
	  this.origin = [0,0]
	  this.currentLevel = __webpack_require__(1)
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var obj = __webpack_require__(2);
	var Level = obj.Level;
	var LevelBuilder = obj.LevelBuilder;
	var builder = new LevelBuilder();

	var foregroundGrid = [
	  builder.rowOf(12, "block"),
	  ["block", "", "", "", "block", "block", "block", "block"],
	  ["block", "", "", "", "block", "block", "block", "block"],
	  ["block", "", "", "", "block", "block", "block", "block"],
	  ["block", "", "", "", "", "", "", ""],
	  ["block"],
	  builder.rowOf(12, "block")
	];

	var backgroundGrid = [
	  builder.rowOf(12, "brick"),
	  builder.rowOf(12, "brick"),
	  builder.rowOf(12, "brick"),
	  builder.rowOf(12, "brick"),
	  builder.rowOf(12, "brick"),
	  builder.rowOf(12, "brick"),
	  builder.rowOf(12, "brick")
	];

	testLevel = new Level("test", foregroundGrid, backgroundGrid);

	module.exports = testLevel;


/***/ },
/* 2 */
/***/ function(module, exports) {

	function Level(name, foregroundGrid, backgroundGrid) {
	  this.name = name;
	  this.foregroundGrid = foregroundGrid;
	  this.backgroundGrid = backgroundGrid;
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
	  LevelBuilder: LevelBuilder
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	const BLOCK_LENGTH = 75;

	function Renderer(context, game) {
	  this.c = context;
	  this.game = game;
	}

	Renderer.prototype.renderScreen = function () {
	  this.renderBackground(this.game.origin, this.game.currentLevel);
	  this.renderForeground(this.game.origin, this.game.currentLevel);
	  this.renderRobot(this.game.robot);
	}

	Renderer.prototype.renderForeground = function (origin, currentLevel) {
	  var row_top_y = 0;
	  for (var row = 0; row < currentLevel.foregroundGrid.length; row++) {
	    var col_left_x = 0;
	    for (var col = 0; col < currentLevel.foregroundGrid[row].length; col++) {

	      var x_block = (-1 * origin[0]) + col_left_x + 0.5;
	      var y_block = (-1 * origin[1]) + row_top_y + 0.5;

	      if (currentLevel.foregroundGrid[row][col] === "block") {
	        this.drawBlock([x_block, y_block]);
	      }

	      col_left_x += 75;
	    }

	    row_top_y += 75;
	  }
	}

	Renderer.prototype.renderBackground = function (origin, currentLevel) {
	  var row_top_y = 0;
	  for (var row = 0; row < currentLevel.backgroundGrid.length; row++) {
	    var col_left_x = 0;
	    for (var col = 0; col < currentLevel.backgroundGrid[row].length; col++) {

	      //skip if there's a block covering this square
	      if (currentLevel.foregroundGrid[row][col] === "block") {
	        col_left_x += 75;
	        continue;
	      }

	      var x_block = (-1 * origin[0]) + col_left_x + 0.5;
	      var y_block = (-1 * origin[1]) + row_top_y + 0.5;

	      if(currentLevel.backgroundGrid[row][col] === "brick"){
	        var leftEdges = currentLevel.foregroundGrid[row][col - 1] !== "block"
	        this.drawBrick([x_block, y_block], '#39a33c', leftEdges);
	      }

	      col_left_x += 75;
	    }

	    row_top_y += 75;
	  }
	}

	Renderer.prototype.renderRobot = function (robot) {
	  this.drawOuterSquare(robot.pos, 'red');
	}

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
	  this.c.stroke();
	  if(fill != undefined){
	    this.c.fillStyle = fill;
	    this.c.fill();
	  }
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


/***/ }
/******/ ]);