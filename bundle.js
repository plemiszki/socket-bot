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

	var Renderer = __webpack_require__(1)
	var Game = __webpack_require__(2)

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
/* 1 */
/***/ function(module, exports) {

	const BLOCK_LENGTH = 75;
	const EDGE_TO_INNER = 8;
	const INNER_RECT_LENGTH = BLOCK_LENGTH - (EDGE_TO_INNER * 2);

	function Renderer(context, game) {
	  this.c = context;
	  this.game = game;
	  this.gradientArray = this.fillGradientArray("rgb(43,216,233)", 50);
	  this.gradientIndex = 0;
	  this.gradientSign = 1;
	  this.BUTTON_PANEL_WIDTH = 15;
	  this.BUTTON_PANEL_HEIGHT = 30;
	}

	Renderer.prototype.renderScreen = function () {
	  var cornerSquares = this.getVisibleSquares(this.game.origin, this.game.currentLevel);
	  this.incrementGradientIndex();
	  this.incrementDoors();
	  this.renderBackground(this.game.origin, this.game.currentLevel, cornerSquares);
	  this.renderWiring(this.game.origin, this.game.currentLevel, cornerSquares);
	  this.renderForeground(this.game.origin, this.game.currentLevel, cornerSquares);
	  this.renderElevators(this.game.origin, this.game.currentLevel, cornerSquares);
	  this.renderCubbies(this.game.origin, this.game.currentLevel, cornerSquares);
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
	        this.drawDoor(currentLevel.foregroundGrid[row][col],[x_block, y_block]);
	      } else if (currentLevel.foregroundGrid[row][col].toString() === "buttonBlock") {
	        this.drawButtonBlock(currentLevel.foregroundGrid[row][col],[x_block, y_block]);
	      } else if (currentLevel.foregroundGrid[row][col].toString() === "powerSource") {
	        this.drawPowerBlock([x_block, y_block], currentLevel.foregroundGrid[row][col]);
	      } else if (currentLevel.foregroundGrid[row][col] === "powerBlock") {
	        this.drawPowerBlock([x_block, y_block], currentLevel.foregroundGrid[row][col]);
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
	        var additionalPixels = currentLevel.elevators[elv].additionalPixels;
	        var x_block = (-1 * origin[0]) + col_left_x + 0.5;
	        var platform_top_y = (BLOCK_LENGTH * topRow) - origin[1] + 0.5;
	        var adjustedPlatformTop = platform_top_y - additionalPixels;
	        const COLUMN_WIDTH = 25;
	        var inset = Math.floor((BLOCK_LENGTH - COLUMN_WIDTH) / 2)
	        var column_top_y = adjustedPlatformTop + Math.floor(BLOCK_LENGTH/3);

	        var realBaseBottomY = ((currentLevel.elevators[elv].baseRow + 1) * BLOCK_LENGTH) + 0.5;
	        var relBaseBottomY = realBaseBottomY - origin[1]
	        var height = relBaseBottomY - column_top_y

	        if (450 - column_top_y < height) {
	          height = 450 - column_top_y;
	        }

	        var grad = this.c.createLinearGradient(x_block + inset, 0, x_block + inset + COLUMN_WIDTH, 0);
	        grad.addColorStop(0, '#1A1919');
	        grad.addColorStop(0.5, '#68625F');
	        grad.addColorStop(1, '#1A1919');

	        this.c.beginPath();
	        this.c.rect(x_block + inset, column_top_y, COLUMN_WIDTH, height)
	        this.c.fillStyle = grad;
	        this.c.fill();
	        this.c.strokeStyle = '#000';
	        this.c.stroke();

	        this.drawPlatform([x_block, adjustedPlatformTop], '#67480E', '#211705');
	      }
	    }

	    col_left_x += 75;
	  }
	};

	Renderer.prototype.renderCubbies = function (origin, currentLevel, cornerSquares) {
	  var col_left_x = cornerSquares[1] * BLOCK_LENGTH;
	  //iterate through each visible column:
	  for (var col = cornerSquares[1]; col <= cornerSquares[3]; col++) {
	    //iterate through cubbies to see if there's one in this column:
	    for (var cubby = 0; cubby < currentLevel.cubbies.length; cubby++) {
	      if (currentLevel.cubbies[cubby].rowCol[1] === col) {
	        //if so, find where the top is:
	        var x_block = (-1 * origin[0]) + col_left_x + 0.5;
	        var y_block = (BLOCK_LENGTH * currentLevel.cubbies[cubby].rowCol[0]) - origin[1] + 0.5;
	        this.drawCubby([x_block, y_block]);
	      }
	    }

	    col_left_x += 75;
	  }
	};

	Renderer.prototype.renderWiring = function (origin, currentLevel, cornerSquares) {
	  var col_left_x = cornerSquares[1] * BLOCK_LENGTH;
	  //iterate through each visible column:
	  for (var col = cornerSquares[1]; col <= cornerSquares[3]; col++) {
	    //iterate through wiring to see if there's one in this column:
	    for (var wire = 0; wire < currentLevel.wiring.length; wire++) {
	      if (currentLevel.wiring[wire].rowCol[1] === col) {
	        //if so, find where the top is:
	        var x_block = (-1 * origin[0]) + col_left_x + 0.5;
	        var y_block = (BLOCK_LENGTH * currentLevel.wiring[wire].rowCol[0]) - origin[1] + 0.5;
	        this.drawWire([x_block, y_block], currentLevel.wiring[wire]);
	      }
	    }

	    col_left_x += 75;
	  }
	};

	Renderer.prototype.renderRobot = function (robot) {
	  var x = robot.pos[0] + 10;
	  var y = robot.pos[1] + 10;
	  this.drawFrame({
	    x: x,
	    y: y,
	    width: 54,
	    height: 54,
	    thickness: 5,
	    fill: 'yellow'
	  });

	  var x2 = x + 5;
	  var y2 = y + 5;
	  this.drawFrame({
	    x: x2,
	    y: y2,
	    width: 44,
	    height: 44,
	    thickness: 5,
	    fill: '#8C8400'
	  });

	  this.drawLine([x2, y2], [x2 + 5, y2 + 5]);
	  this.drawLine([x2, y2 + 44], [x2 + 5, y2 + 39]);
	  this.drawLine([x2 + 44, y2], [x2 + 39, y2 + 5]);
	  this.drawLine([x2 + 44, y2 + 44], [x2 + 39, y2 + 39]);

	  //left wheel:
	  var leftWheelCenter = [robot.pos[0] + 5, robot.pos[1] + BLOCK_LENGTH - 5]

	  //left arm:
	  this.drawRectangle({
	    x: robot.pos[0],
	    y: robot.pos[1] + 30,
	    width: 5,
	    height: 15,
	    fill: 'yellow',
	    stroke: '#000'
	  })
	  this.drawRectangle({
	    x: leftWheelCenter[0],
	    y: robot.pos[1] + 37,
	    width: 3,
	    height: 30,
	    fill: 'yellow',
	    stroke: '#000'
	  })

	  this.c.beginPath();
	  this.c.arc(
	    leftWheelCenter[0],
	    leftWheelCenter[1],
	    5, 0, 2 * Math.PI, false
	  );
	  this.c.fillStyle = '#000';
	  this.c.fill();

	  this.c.beginPath();
	  this.c.arc(
	    leftWheelCenter[0],
	    leftWheelCenter[1],
	    8, 1.5 * Math.PI, 2 * Math.PI, false
	  );
	  this.c.lineTo(leftWheelCenter[0], leftWheelCenter[1])
	  this.c.closePath();
	  this.c.fillStyle = 'yellow';
	  this.c.fill();
	  this.c.stroke();

	  //right wheel:
	  var rightWheelCenter = [robot.pos[0] + BLOCK_LENGTH - 6, robot.pos[1] + BLOCK_LENGTH - 5]

	  //right arm:
	  this.drawRectangle({
	    x: robot.pos[0] + BLOCK_LENGTH - 6,
	    y: robot.pos[1] + 30,
	    width: 5,
	    height: 15,
	    fill: 'yellow',
	    stroke: '#000'
	  })
	  this.drawRectangle({
	    x: rightWheelCenter[0] - 3,
	    y: robot.pos[1] + 37,
	    width: 3,
	    height: 30,
	    fill: 'yellow',
	    stroke: '#000'
	  })

	  this.c.beginPath();
	  this.c.arc(
	    rightWheelCenter[0],
	    rightWheelCenter[1],
	    5, 0, 2 * Math.PI, false
	  );
	  this.c.fillStyle = '#000';
	  this.c.fill();

	  this.c.beginPath();
	  this.c.arc(
	    rightWheelCenter[0],
	    rightWheelCenter[1],
	    8, Math.PI, 1.5 * Math.PI, false
	  );
	  this.c.lineTo(rightWheelCenter[0], rightWheelCenter[1])
	  this.c.closePath();
	  this.c.fillStyle = 'yellow';
	  this.c.fill();
	  this.c.stroke();
	};

	Renderer.prototype.drawDoor = function (door, pos) {
	  if (door.status !== "open") {
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

	    var openSpace = (BLOCK_LENGTH - 1) * door.percentOpen;
	    var doorHalfHeight = ((BLOCK_LENGTH - 1) - openSpace) / 2;

	    this.drawRectangle({
	      x: topLeftCorner[0],
	      y: topLeftCorner[1] - 1,
	      width: width,
	      height: doorHalfHeight + 1,
	      fill: '#FF0000'
	    });

	    this.drawRectangle({
	      x: topLeftCorner[0],
	      y: topLeftCorner[1] + BLOCK_LENGTH - 1 - doorHalfHeight,
	      width: width,
	      height: doorHalfHeight + 1,
	      fill: '#FF0000'
	    });
	  }
	};

	Renderer.prototype.drawPlatform = function (pos, topColor, bottomColor) {
	  var x = pos[0];
	  var y = pos[1];
	  var height = Math.floor(BLOCK_LENGTH/3);
	  var grad = this.c.createLinearGradient(x, y, x, y + height);
	  grad.addColorStop(0, topColor);
	  grad.addColorStop(1, bottomColor);

	  this.drawRectangle({
	    x: x,
	    y: y,
	    width: BLOCK_LENGTH - 1,
	    height: height,
	    fill: grad
	  });
	};

	Renderer.prototype.drawWire = function (pos, wire) {
	  if (wire.hasPower) {
	    var fill = this.gradientArray[this.gradientIndex]
	  } else {
	    var fill = '#333';
	  }

	  if (wire.type === "EW") {
	    this.drawRectangle({
	      x: pos[0] - 0.5,
	      y: pos[1] + (BLOCK_LENGTH / 2) - 4.5,
	      width: BLOCK_LENGTH + 0.5,
	      height: 9,
	      fill: fill,
	      stroke: 'none'
	    })
	  } else if (wire.type === "NS") {
	    this.drawRectangle({
	      x: pos[0] + (BLOCK_LENGTH / 2) - 4.5,
	      y: pos[1] - 0.5,
	      width: 9,
	      height: BLOCK_LENGTH + 0.5,
	      fill: fill,
	      stroke: 'none'
	    })
	  } else if (wire.type === "ES") {
	    this.c.beginPath();
	    this.c.moveTo(pos[0] + BLOCK_LENGTH, pos[1] + (BLOCK_LENGTH / 2) - 4.5);
	    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) - 4.5, pos[1] + (BLOCK_LENGTH / 2) - 4.5);
	    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) - 4.5, pos[1] + BLOCK_LENGTH);
	    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) + 4.5, pos[1] + BLOCK_LENGTH);
	    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) + 4.5, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.closePath();
	    this.c.fillStyle = fill;
	    this.c.fill();
	  } else if (wire.type === "NE") {
	    this.c.beginPath();
	    this.c.moveTo(pos[0] + (BLOCK_LENGTH / 2) - 4.5, pos[1] - 0.5);
	    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) - 4.5, pos[1] + (BLOCK_LENGTH / 2) + 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH, pos[1] + (BLOCK_LENGTH / 2) + 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH, pos[1] + (BLOCK_LENGTH / 2) - 4.5);
	    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) + 4.5, pos[1] + (BLOCK_LENGTH / 2) - 4.5);
	    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) + 4.5, pos[1] - 0.5);
	    this.c.fillStyle = fill;
	    this.c.fill();
	  }
	};

	Renderer.prototype.drawCubby = function (pos) {
	  var x = pos[0] + 15;
	  var y = pos[1] + 15;

	  this.drawRectangle({
	    x: x,
	    y: y,
	    width: 44,
	    height: 44,
	    fill: '#333'
	  });

	  var CUBBY_THICKNESS = 5;
	  var x2 = x + CUBBY_THICKNESS;
	  var y2 = y + CUBBY_THICKNESS;

	  this.drawRectangle({
	    x: x2,
	    y: y2,
	    width: 34,
	    height: 34,
	    fill: '#1C1C1C'
	  });

	  this.drawLine([x2, y2], [x2 + 34, y2 + 34]);
	  this.drawLine([x2 + 34, y2], [x2, y2 + 34]);

	  var CUBBY_DEPTH = 6;
	  var x3 = x2 + CUBBY_DEPTH;
	  var y3 = y2 + CUBBY_DEPTH;

	  this.drawRectangle({
	    x: x3,
	    y: y3,
	    width: 22,
	    height: 22,
	    fill: '#1C1C1C'
	  });
	};

	Renderer.prototype.drawBrick = function (pos, color, leftEdges) {
	  var x = pos[0];
	  var y = pos[1];
	  var rowHeight = (BLOCK_LENGTH / 4);
	  this.drawOuterSquare(pos, color, color);
	  this.c.strokeStyle = '#000';
	  // for (var i = 0; i < 4; i++) {
	  //   var thisRowY = Math.floor(y + (rowHeight * i)) + 0.5;
	  //   this.drawLine([x, thisRowY], [x + BLOCK_LENGTH - 0.5, thisRowY]);
	  //   if (i % 2 == 0) {
	  //     if (leftEdges === true) {
	  //       this.drawLine([x, thisRowY], [x, thisRowY + rowHeight - 0.5]);
	  //     }
	  //     this.drawLine(
	  //       [x + (BLOCK_LENGTH / 2) + 0.5, thisRowY],
	  //       [x + (BLOCK_LENGTH / 2) + 0.5, thisRowY + rowHeight - 0.5]
	  //     );
	  //   } else {
	  //     this.drawLine(
	  //       [Math.floor(x + (BLOCK_LENGTH / 4)) + 0.5, thisRowY],
	  //       [Math.floor(x + (BLOCK_LENGTH / 4)) + 0.5, thisRowY + rowHeight - 0.5]
	  //     );
	  //     this.drawLine(
	  //       [Math.floor(x + (BLOCK_LENGTH / 4) * 3) + 0.5, thisRowY],
	  //       [Math.floor(x + (BLOCK_LENGTH / 4) * 3) + 0.5, thisRowY + rowHeight - 0.5]
	  //     );
	  //   }
	  // }
	}

	Renderer.prototype.drawButtonBlock = function (buttonBlock, pos) {

	  this.drawPowerBlock(pos);

	  var buttonPanelX;
	  if (buttonBlock.side === "left") {
	    buttonPanelX = pos[0] - this.BUTTON_PANEL_WIDTH
	  } else {
	    buttonPanelX = pos[0] + BLOCK_LENGTH - 1
	  }
	  var buttonPanelY = pos[1] + ((BLOCK_LENGTH - this.BUTTON_PANEL_HEIGHT) / 2) + 0.5
	  var grad = this.c.createLinearGradient(
	    buttonPanelX,
	    buttonPanelY,
	    buttonPanelX,
	    buttonPanelY + this.BUTTON_PANEL_HEIGHT
	  );
	  grad.addColorStop(0, '#858181');
	  grad.addColorStop(1, '#434242');
	  this.drawRectangle({
	    x: buttonPanelX,
	    y: buttonPanelY,
	    width: this.BUTTON_PANEL_WIDTH,
	    height: this.BUTTON_PANEL_HEIGHT,
	    fill: grad
	  });

	  const BUTTON_WIDTH = 5;
	  const BUTTON_HEIGHT = 8;
	  var buttonX;
	  if (buttonBlock.side === "left") {
	    buttonX = buttonPanelX - BUTTON_WIDTH;
	  } else {
	    buttonX = buttonPanelX + this.BUTTON_PANEL_WIDTH;
	  }
	  this.drawRectangle({
	    x: buttonX,
	    y: buttonPanelY + ((this.BUTTON_PANEL_HEIGHT - BUTTON_HEIGHT) / 2),
	    width: BUTTON_WIDTH,
	    height: BUTTON_HEIGHT,
	    fill: '#FF0000'
	  });
	};

	Renderer.prototype.drawPowerBlock = function (pos) {
	  this.drawOuterSquare(pos, '#000', this.gradientArray[this.gradientIndex]);
	  this.drawRectangle({
	    x: pos[0] + EDGE_TO_INNER,
	    y: pos[1] + EDGE_TO_INNER,
	    width: INNER_RECT_LENGTH,
	    height: INNER_RECT_LENGTH
	  });
	};

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

	  const TRI_LENGTH = 40;
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
	  this.drawRectangle({
	    x: pos[0],
	    y: pos[1],
	    width: BLOCK_LENGTH - 1,
	    height: BLOCK_LENGTH - 1,
	    stroke: stroke,
	    fill: fill
	  });
	}

	Renderer.prototype.drawLine = function (start, finish) {
	  this.c.beginPath();
	  this.c.moveTo(start[0], start[1]);
	  this.c.lineTo(finish[0], finish[1]);
	  this.c.lineWidth = 1;
	  this.c.stroke();
	}

	Renderer.prototype.drawRectangle = function (object) {
	  var x = object.x;
	  var y = object.y;
	  var width = object.width;
	  var height = object.height;
	  var stroke = object.stroke || '#000';
	  var fill = object.fill || undefined;
	  this.c.beginPath();
	  this.c.rect(x, y, width, height);
	  if (fill !== undefined) {
	    this.c.fillStyle = fill;
	    this.c.fill();
	  }
	  if (stroke !== 'none') {
	    this.c.strokeStyle = stroke;
	    this.c.stroke();
	  }
	};

	Renderer.prototype.drawFrame = function (object) {
	  var x = object.x;
	  var y = object.y;
	  var width = object.width;
	  var height = object.height;
	  var thickness = object.thickness;
	  var stroke = object.stroke || '#000';
	  var fill = object.fill || undefined;
	  this.c.beginPath();
	  this.c.rect(x, y, width, thickness);
	  if (fill !== undefined) {
	    this.c.fillStyle = fill;
	    this.c.fill();
	  }
	  this.c.beginPath();
	  this.c.rect(x, y, thickness, height);
	  if (fill !== undefined) {
	    this.c.fillStyle = fill;
	    this.c.fill();
	  }
	  this.c.beginPath();
	  this.c.rect(x + width - thickness, y, thickness, height);
	  if (fill !== undefined) {
	    this.c.fillStyle = fill;
	    this.c.fill();
	  }
	  this.c.beginPath();
	  this.c.rect(x, y + height - thickness, width, thickness);
	  if (fill !== undefined) {
	    this.c.fillStyle = fill;
	    this.c.fill();
	  }
	  this.c.beginPath();
	  this.c.rect(x, y, width, height);
	  this.c.strokeStyle = stroke;
	  this.c.stroke();

	  this.c.beginPath();
	  this.c.rect(x + thickness, y + thickness, width - (thickness * 2), height - (thickness * 2));
	  this.c.strokeStyle = stroke;
	  this.c.stroke();
	};

	Renderer.prototype.incrementDoors = function () {
	  this.game.currentLevel.doors.forEach(function (door) {
	    if (door.status === "opening") {
	      door.percentOpen = door.percentOpen + 0.02;
	      if (door.percentOpen >= 1) {
	        door.status = "open";
	      }
	    }
	  });
	};

	Renderer.prototype.incrementGradientIndex = function () {
	  this.gradientIndex = this.gradientIndex + (1 * this.gradientSign)
	  if (this.gradientIndex === this.gradientArray.length) {
	    this.gradientSign = -1;
	    this.gradientIndex = this.gradientArray.length - 2
	  } else if (this.gradientIndex === -1) {
	    this.gradientSign = 1;
	    this.gradientIndex = 1;
	  }
	};

	Renderer.prototype.fillGradientArray = function (rgbColor, arrayLength) {
	  returnArray = [rgbColor];
	  for (var i = 0; i < arrayLength; i++) {
	    rgbColor = this.shadeRGBColor(rgbColor, -0.02)
	    returnArray.push(rgbColor);
	  }
	  return returnArray;
	};

	Renderer.prototype.shadeRGBColor = function (color, percent) {
	    var f = color.split(",");
	    var t = percent < 0 ? 0 : 255;
	    var p = percent < 0 ? percent * -1 : percent;
	    var R = parseInt(f[0].slice(4));
	    var G = parseInt(f[1]);
	    var B = parseInt(f[2]);
	    return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
	}

	module.exports = Renderer;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Robot = __webpack_require__(3)
	var Renderer = __webpack_require__(1)
	const BLOCK_LENGTH = 75;

	function Game(renderer) {
	  this.renderer = renderer;
	  this.BLOCK_LENGTH = 75;
	  var level1 = __webpack_require__(4);
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
	  this.updatePower();
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

	    ghostArrays = this.moveUp(this.elevatorArray[0].speed, modifier);
	    this.elevatorArray.forEach(function (elevator) {
	      elevator.additionalPixels += (elevator.speed * modifier);
	    }.bind(this))

	  } else if (this.status === "descending") {

	    ghostArrays = this.moveDown(this.elevatorArray[0].speed, modifier);
	    this.elevatorArray.forEach(function (elevator) {
	      elevator.additionalPixels -= (elevator.speed * modifier);
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
	      } else if (this.getLeftButtonEdge(ghostArrays) !== -1) {
	        var buttonStuff = this.getLeftButtonEdge(ghostArrays);
	        var edge = buttonStuff[0];
	        var button = buttonStuff[1];
	        robotX = this.getRealRightX(realArrays);
	        difference = edge - robotX;
	        ghostArrays = this.moveRight(difference, 1);
	        button.pushFunc();
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
	      } else if (this.getRightButtonEdge(ghostArrays) !== -1) {
	        var buttonStuff = this.getRightButtonEdge(ghostArrays);
	        var edge = buttonStuff[0];
	        var button = buttonStuff[1];
	        robotX = this.getRealLeftX(realArrays);
	        difference = robotX - edge;
	        ghostArrays = this.moveLeft(difference, 1);
	        button.pushFunc();
	      }
	    } else if (32 in this.keysDown) { //space
	      var robotLeft = this.getRealLeftX(realArrays);
	      var leftColumn = this.getLeftColumn(realArrays);
	      var leftEdge = (this.BLOCK_LENGTH * leftColumn) + 0.5;
	      var distanceToLeftEdge = robotLeft - leftEdge;
	      if (distanceToLeftEdge <= 15) {
	        this.moveLeft(distanceToLeftEdge, 1);
	        console.log("nudge left!");
	      } else {
	        var robotRight = this.getRealRightX(realArrays);
	        var rightColumn = this.getRightColumn(realArrays);
	        var rightEdge = this.BLOCK_LENGTH * (rightColumn + 1);
	        var distanceToRightEdge = rightEdge - robotRight;
	        if (distanceToRightEdge <= 15) {
	          this.moveRight(distanceToRightEdge, 1);
	          console.log("nudge right!");
	        }
	      }
	    }
	  }

	  this.setGhostToReal(ghostArrays);
	  this.updateDebugHTML(realArrays);
	  if (this.status === "rising" || this.status === "descending") {
	    this.checkElevator();
	  }
	};

	Game.prototype.updatePower = function () {
	  for (var i = 0; i < this.currentLevel.powerSources.length; i++) {
	    this.currentLevel.powerSources[i].sendPower(this.currentLevel.wiring);
	  }
	};

	Game.prototype.getLeftButtonEdge = function (arrays) {
	  var nextColumnToRight = this.getRightColumn(arrays) + 1
	  if (
	    this.currentLevel.foregroundGrid[
	      this.getTopRow(arrays)][nextColumnToRight].toString() === "buttonBlock"
	  ) {
	    var button = this.currentLevel.foregroundGrid[this.getTopRow(arrays)][nextColumnToRight];
	    var robotRightX = this.getRealRightX(arrays);
	    var blockRealRightX = this.getBlockRealRightX(this.getRightColumn(arrays));
	    var buttonEdge = blockRealRightX - this.renderer.BUTTON_PANEL_WIDTH - 1;
	    if (robotRightX > buttonEdge) {
	      return [buttonEdge, button];
	    } else {
	      return -1;
	    }
	  } else {
	    return -1;
	  }
	};

	Game.prototype.getRightButtonEdge = function (arrays) {
	  var nextColumnToLeft = this.getLeftColumn(arrays) - 1
	  if (
	    this.currentLevel.foregroundGrid[
	      this.getTopRow(arrays)][nextColumnToLeft].toString() === "buttonBlock"
	  ) {
	    var button = this.currentLevel.foregroundGrid[this.getTopRow(arrays)][nextColumnToLeft]
	    var robotLeftX = this.getRealLeftX(arrays);
	    var blockRealLeftX = this.getBlockRealLeftX(this.getLeftColumn(arrays));
	    var buttonEdge = blockRealLeftX + this.renderer.BUTTON_PANEL_WIDTH
	    if (robotLeftX < buttonEdge) {
	      return [buttonEdge, button];
	    } else {
	      return -1;
	    }
	  } else {
	    return -1;
	  }
	};

	Game.prototype.passThrough = function (object) {
	  if ( object === "block" || object === "platform"
	      || object.toString() === "door" && object.status === "closed"
	      || object.toString() === "buttonBlock"
	      || object.toString() === "powerSource"
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

	Game.prototype.getBlockRealRightX = function (column) {
	  return (0.5 + (column + 1) * this.BLOCK_LENGTH);
	};

	Game.prototype.getBlockRealLeftX = function (column) {
	  return (0.5 + (column) * this.BLOCK_LENGTH);
	};

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


/***/ },
/* 3 */
/***/ function(module, exports) {

	function Robot(startingPos) {
	  this.pos = startingPos;
	  this.speed = 256;
	};

	module.exports = Robot;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var obj = __webpack_require__(5);
	var Level = obj.Level;
	var LevelBuilder = obj.LevelBuilder;
	var Door = obj.Door;
	var Elevator = obj.Elevator;
	var ButtonBlock = obj.ButtonBlock;
	var Cubby = obj.Cubby;
	var Wire = obj.Wire;
	var PowerSource = obj.PowerSource;

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
	    heights: [0, 4, 8]
	  }),
	  new Elevator({
	    id: 101,
	    baseRowCol: [10, 6],
	    startingHeight: 4,
	    heights: [0, 4, 8]
	  }),
	  new Elevator({
	    id: 102,
	    baseRowCol: [10, 1],
	    startingHeight: 0,
	    heights: [0, 6]
	  }),
	  new Elevator({
	    id: 103,
	    baseRowCol: [12, 17],
	    startingHeight: 6,
	    heights: [0, 3, 6, 10]
	  }),
	  new Elevator({
	    id: 103,
	    baseRowCol: [12, 18],
	    startingHeight: 6,
	    heights: [0, 3, 6, 10]
	  })
	];

	var cubbies = [
	  new Cubby({
	    id: "C101",
	    rowCol: [1, 2]
	  }),
	  new Cubby({
	    id: "C102",
	    rowCol: [5, 8]
	  }),
	];

	var powerSources = [
	  new PowerSource({
	    id: "PS101",
	    rowCol: [11, 22]
	  })
	]

	var wiring = [
	  new Wire({ id: 101, rowCol: [3, 5] }),
	  new Wire({ id: 102, rowCol: [3, 6] }),
	  new Wire({ id: 103, rowCol: [3, 7] }),
	  new Wire({ id: 104, rowCol: [4, 7] }),

	  new Wire({ id: 104, rowCol: [11, 21], type: "EW" }),
	  new Wire({ id: 104, rowCol: [11, 20], type: "EW" }),
	  new Wire({ id: 104, rowCol: [11, 19], type: "EW" }),
	  new Wire({ id: 104, rowCol: [11, 18], type: "EW" }),
	  new Wire({ id: 104, rowCol: [11, 17], type: "EW" }),
	  new Wire({ id: 104, rowCol: [11, 16], type: "EW" }),
	  new Wire({ id: 104, rowCol: [11, 15], type: "EW" }),
	  new Wire({ id: 104, rowCol: [11, 14], type: "NE" }),
	  new Wire({ id: 104, rowCol: [10, 14], type: "NS" }),
	  new Wire({ id: 104, rowCol: [9, 14], type: "NS" }),
	  new Wire({ id: 104, rowCol: [8, 14], type: "NS" }),
	  new Wire({ id: 104, rowCol: [7, 14], type: "NS" }),
	  new Wire({ id: 104, rowCol: [6, 14], type: "NS" }),
	  new Wire({ id: 104, rowCol: [5, 14], type: "NS" }),
	  new Wire({ id: 104, rowCol: [4, 14], type: "ES" }),
	  new Wire({ id: 104, rowCol: [4, 15], type: "EW" }),
	  new Wire({ id: 104, rowCol: [4, 16], type: "EW" }),
	  new Wire({ id: 104, rowCol: [4, 17], type: "EW" }),
	  new Wire({ id: 104, rowCol: [4, 18], type: "EW" })
	]

	var buttonBlocks = [
	  new ButtonBlock({
	    id: "BB101",
	    side: "left",
	    rowCol: [0, 0],
	    func: function () {
	      doors[0].open();
	    }
	  }),
	  new ButtonBlock({
	    id: "BB102",
	    side: "right",
	    rowCol: [0, 0],
	    func: function () {
	      doors[1].open();
	    }
	  })

	  // new ButtonBlock(101, "left", function () {
	  //   doors[0].open();
	  // }),
	  // new ButtonBlock(102, "right", function () {
	  //   doors[1].open();
	  // })
	];

	var foregroundGrid = [
	  builder.rowOf(24, "block"),
	  ["block"].concat(builder.rowOf(2, "")).concat(doors[0]).concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(6, "")).concat([buttonBlocks[1]]).concat(builder.rowOf(4, "")).concat(doors[1]).concat(builder.rowOf(3, "")).concat(["block"]),
	  builder.rowOf(5, "block").concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(6, "")).concat(builder.rowOf(3, "platform")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
	  ["block"].concat(builder.rowOf(3, "")).concat([buttonBlocks[0]]).concat(builder.rowOf(12, "")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
	  ["block"].concat([""]).concat(builder.rowOf(3, "block")).concat(builder.rowOf(14, "")).concat([buttonBlocks[0]]).concat(builder.rowOf(3, "")).concat(["block"]),
	  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(18, "")).concat(["block"]),
	  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(7, "block")).concat(["platform"]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
	  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(5, "block")).concat([""]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(6, "")).concat(["block"]),
	  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(5, "block")).concat([""]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(6, "")).concat(["block"]),
	  ["block"].concat(builder.rowOf(4, "")).concat(builder.rowOf(4, "")).concat(builder.rowOf(5, "block")).concat([""]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
	  ["block", ""].concat(builder.rowOf(3, "block")).concat(builder.rowOf(2, elevators[0])).concat(builder.rowOf(7, "block")).concat([""]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(5, "")).concat(builder.rowOf(2, "powerBlock")),
	  builder.rowOf(14, "block").concat(builder.rowOf(8, "")).concat([powerSources[0]]).concat(["powerBlock"]),
	  builder.rowOf(17, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block"))
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

	// level1 = new Level("Level 1", foregroundGrid, backgroundGrid, [938, 375.5], elevators);
	level1 = new Level("Level 1", foregroundGrid, backgroundGrid, [550, 375.5], elevators, doors, cubbies, wiring, powerSources);

	module.exports = level1;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Door = __webpack_require__(6)
	var Elevator = __webpack_require__(7)
	var ButtonBlock = __webpack_require__(8)
	var Cubby = __webpack_require__(10)
	var Wire = __webpack_require__(11)
	var PowerSource = __webpack_require__(12)

	function Level(name, foregroundGrid, backgroundGrid, robotPos, elevators, doors, cubbies, wiring, powerSources) {
	  this.name = name;
	  this.foregroundGrid = foregroundGrid;
	  this.backgroundGrid = backgroundGrid;
	  this.startingPos = robotPos;
	  this.elevators = elevators;
	  this.doors = doors;
	  this.cubbies = cubbies;
	  this.wiring = wiring;
	  this.powerSources = powerSources;
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
	  Elevator: Elevator,
	  ButtonBlock: ButtonBlock,
	  Cubby: Cubby,
	  Wire: Wire,
	  PowerSource: PowerSource
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	function Door(id, side) {
	  this.toString = function () { return "door" };
	  this.id = id;
	  this.status = "closed";
	  this.percentOpen = 0;
	  this.aniFrame = undefined;
	  this.side = side;
	};

	Door.prototype.open = function () {
	  if(this.status !== "open") {
	    this.status = "opening";
	  }
	};

	module.exports = Door;


/***/ },
/* 7 */
/***/ function(module, exports) {

	function Elevator(options) {
	  this.id = options.id;
	  this.col = options.baseRowCol[1];
	  this.baseRow = options.baseRowCol[0];
	  this.blocksHigh = options.startingHeight || 0;
	  this.speed = options.speed || 400;
	  this.heights = options.heights;

	  this.topRow = this.baseRow - this.blocksHigh;
	  this.additionalPixels = 0;
	  this.toString = function () { return "elevator" };
	}

	module.exports = Elevator;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var PowerObject = __webpack_require__(9);

	function ButtonBlock(options) {
	  this.initializePowerObject(options);
	  this.id = options.id;
	  this.side = options.side;
	  this.rowCol = options.rowCol;
	  this.pushFunc = options.func;
	  this.toString = function () { return "buttonBlock" };
	}

	var Surrogate = function () {};
	Surrogate.prototype = PowerObject.prototype;
	ButtonBlock.prototype = new Surrogate();
	ButtonBlock.prototype.constructor = ButtonBlock;

	module.exports = ButtonBlock;


/***/ },
/* 9 */
/***/ function(module, exports) {

	function PowerObject() {
	}

	PowerObject.prototype.initializePowerObject = function (options) {
	  this.hasPower = false;
	  if (options) {
	    this.rowCol = options.rowCol;
	  } else {
	    debugger
	  }
	};

	PowerObject.prototype.getPowerStatus = function () {
	  return (this.hasPower)
	};

	module.exports = PowerObject;


/***/ },
/* 10 */
/***/ function(module, exports) {

	function Cubby(options) {
	  this.id = options.id;
	  this.rowCol = options.rowCol;
	  this.item = options.startItem;

	  this.toString = function () { return "cubby" };
	}

	module.exports = Cubby;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var PowerObject = __webpack_require__(9);

	function Wire(options) {
	  this.initializePowerObject(options);
	  this.id = options.id;
	  this.rowCol = options.rowCol;
	  this.type = options.type;
	}

	var Surrogate = function () {};
	Surrogate.prototype = PowerObject.prototype;
	Wire.prototype = new Surrogate();
	Wire.prototype.constructor = Wire;

	Wire.prototype.sendPower = function (wiring, flowing) {
	  var topRowCol = [this.rowCol[0] - 1, this.rowCol[1]];
	  var leftRowCol = [this.rowCol[0], this.rowCol[1] - 1];
	  var rightRowCol = [this.rowCol[0], this.rowCol[1] + 1];
	  var bottomRowCol = [this.rowCol[0] + 1, this.rowCol[1]];

	  //look through wires:
	  for (var i = 0; i < wiring.length; i++) {
	    if (wiring[i].rowCol[0] === leftRowCol[0] && wiring[i].rowCol[1] === leftRowCol[1] && flowing !== "rightward") {
	      wiring[i].hasPower = true;
	      wiring[i].sendPower(wiring, "leftward");
	    }
	    if (wiring[i].rowCol[0] === topRowCol[0] && wiring[i].rowCol[1] === topRowCol[1] && flowing !== "downward") {
	      wiring[i].hasPower = true;
	      wiring[i].sendPower(wiring, "upward");
	    }
	    if (wiring[i].rowCol[0] === rightRowCol[0] && wiring[i].rowCol[1] === rightRowCol[1] && flowing !== "leftward") {
	      wiring[i].hasPower = true;
	      wiring[i].sendPower(wiring, "rightward");
	    }
	    if (wiring[i].rowCol[0] === bottomRowCol[0] && wiring[i].rowCol[1] === bottomRowCol[1] && flowing !== "upward") {
	      wiring[i].hasPower = true;
	      wiring[i].sendPower(wiring, "downward");
	    }
	  }
	}

	module.exports = Wire;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var PowerObject = __webpack_require__(9);

	function PowerSource(options) {
	  this.initializePowerObject(options);
	  this.id = options.id;
	  this.toString = function () { return "powerSource" };
	}

	var Surrogate = function () {};
	Surrogate.prototype = PowerObject.prototype;
	PowerSource.prototype = new Surrogate();
	PowerSource.prototype.constructor = PowerSource;


	PowerSource.prototype.sendPower = function (wiring) {
	  var topRowCol = [this.rowCol[0] - 1, this.rowCol[1]];
	  var leftRowCol = [this.rowCol[0], this.rowCol[1] - 1];
	  var rightRowCol = [this.rowCol[0], this.rowCol[1] + 1];
	  var bottomRowCol = [this.rowCol[0] + 1, this.rowCol[1]];

	  //look through wires:
	  for (var i = 0; i < wiring.length; i++) {
	    if (wiring[i].rowCol[0] === leftRowCol[0] && wiring[i].rowCol[1] === leftRowCol[1]) {
	      wiring[i].hasPower = true;
	      wiring[i].sendPower(wiring, "left");
	    }
	  }
	}

	module.exports = PowerSource;


/***/ }
/******/ ]);