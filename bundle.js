/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _renderer = __webpack_require__(1);
	
	var _renderer2 = _interopRequireDefault(_renderer);
	
	var _game = __webpack_require__(10);
	
	var _game2 = _interopRequireDefault(_game);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	document.addEventListener("DOMContentLoaded", function () {
	  var canvas = document.getElementById('canvas');
	  var context = canvas.getContext("2d");
	  var renderer = new _renderer2.default(context);
	  var levelSequence = [__webpack_require__(11), __webpack_require__(19), __webpack_require__(20), __webpack_require__(21)];
	
	  var gameInstance = new _game2.default(renderer, levelSequence);
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _wire = __webpack_require__(2);
	
	var _wire2 = _interopRequireDefault(_wire);
	
	var _wireJunction = __webpack_require__(3);
	
	var _wireJunction2 = _interopRequireDefault(_wireJunction);
	
	var _robot = __webpack_require__(5);
	
	var _robot2 = _interopRequireDefault(_robot);
	
	var _door = __webpack_require__(6);
	
	var _door2 = _interopRequireDefault(_door);
	
	var _buttonBlock = __webpack_require__(7);
	
	var _buttonBlock2 = _interopRequireDefault(_buttonBlock);
	
	var _cubby = __webpack_require__(8);
	
	var _cubby2 = _interopRequireDefault(_cubby);
	
	var _panel = __webpack_require__(9);
	
	var _panel2 = _interopRequireDefault(_panel);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var BLOCK_LENGTH = 75;
	var EDGE_TO_INNER = 8;
	var INNER_RECT_LENGTH = BLOCK_LENGTH - EDGE_TO_INNER * 2;
	
	
	function Renderer(context, game) {
	  this.c = context;
	  this.game = game;
	  this.gradientArray = this.fillGradientArray("rgb(43,216,233)", 50);
	  this.gradientIndex = 0;
	  this.gradientSign = 1;
	  this.BUTTON_PANEL_WIDTH = 15;
	  this.BUTTON_PANEL_HEIGHT = 30;
	  this.seconds = 0;
	  this.showLevelName = true;
	}
	
	Renderer.prototype.renderScreen = function () {
	  if (this.game.status === "end screen") {
	    this.displayEndScreen();
	  } else {
	    var cornerSquares = this.getVisibleSquares(this.game.origin, this.game.currentLevel);
	    this.incrementGradientIndex();
	    this.incrementTime();
	    this.incrementDoors();
	    this.renderBackground(this.game.origin, this.game.currentLevel, cornerSquares);
	    this.renderBackgroundObjects(this.game.currentLevel.wiring, this.game.origin, this.game.currentLevel, cornerSquares);
	    this.renderBackgroundObjects(this.game.currentLevel.cubbies, this.game.origin, this.game.currentLevel, cornerSquares);
	    this.renderForeground(this.game.origin, this.game.currentLevel, cornerSquares);
	    this.renderElevators(this.game.origin, this.game.currentLevel, cornerSquares);
	    this.renderRobot(this.game.robot);
	    if (this.game.currentLevel.messages) {
	      this.renderMessage(this.game.currentLevel.messages);
	    }
	    if (this.game.currentLevel.name && this.showLevelName) {
	      this.renderLevelName();
	    }
	  }
	};
	
	Renderer.prototype.toggleLevelName = function (n) {
	  this.showLevelName = !this.showLevelName;
	  return n - 1;
	};
	
	Renderer.prototype.renderMessage = function (messages) {
	  var realArrays = [this.game.origin, this.game.robot.pos];
	  var topRow = this.game.getTopRow(realArrays);
	  var bottomRow = this.game.getBottomRow(realArrays);
	  var leftCol = this.game.getLeftColumn(realArrays);
	  var rightCol = this.game.getRightColumn(realArrays);
	  for (var i = 0; i < messages.length; i++) {
	    if (messages[i].left <= leftCol && messages[i].right >= rightCol && messages[i].top <= topRow && messages[i].bottom >= bottomRow) {
	      var addY = messages[i].pos === "bottom" ? 295 : 0;
	      this.drawRectangle({
	        x: 5,
	        y: 5 + addY,
	        width: 590,
	        height: 145,
	        fill: 'black',
	        alpha: 0.7
	      });
	      this.c.fillStyle = 'white';
	      this.c.font = "bold 26px 'Inconsolata'";
	      this.c.textAlign = "center";
	      if (messages[i].text2) {
	        this.c.fillText(messages[i].text, 300, 55 + addY);
	        this.c.fillText(messages[i].text2, 300, 115 + addY);
	      } else {
	        this.c.fillText(messages[i].text, 300, 85 + addY);
	      }
	    }
	  }
	};
	
	Renderer.prototype.renderLevelName = function () {
	  this.drawRectangle({
	    x: 100.5,
	    y: 50.5,
	    width: 400,
	    height: 100,
	    fill: 'black',
	    alpha: 0.8
	  });
	  this.c.textAlign = "left";
	  this.c.fillStyle = 'white';
	  this.c.font = "bold 60px 'Inconsolata'";
	  this.c.fillText(this.game.currentLevel.name, 200.5, 120.5);
	};
	
	Renderer.prototype.displayLoadScreen = function () {
	  this.blackBackground();
	  var loadGame = window.setInterval(function () {
	    clearInterval(loadGame);
	    this.game.showMainMenu();
	  }.bind(this), 1000);
	};
	
	Renderer.prototype.displayMenu = function () {
	  this.blackBackground();
	  this.c.fillStyle = 'white';
	  this.c.font = "bold italic 90px 'Inconsolata'";
	  this.c.fillText("Socket", 40, 110);
	  this.c.fillText("Bot", 100, 190);
	  this.drawFullCircle({
	    pos: [450, 125],
	    radius: 100,
	    fill: '#58D3F7'
	  });
	  var menuRobot = new _robot2.default([413.5, 120.5]);
	  menuRobot.height = 70;
	  this.renderRobot(menuRobot);
	  this.c.fillStyle = 'white';
	  this.c.font = "bold 30px 'Inconsolata'";
	  this.c.fillText("A 2D Puzzle Game by Peter Lemiszki", 40, 280);
	  this.c.fillStyle = 'yellow';
	  this.c.font = "bold 30px 'Inconsolata'";
	  this.c.fillText("Push SPACEBAR to Start", 136, 370);
	};
	
	Renderer.prototype.displayEndScreen = function () {
	  this.blackBackground();
	  this.c.fillStyle = 'white';
	  this.c.font = "bold 60px 'Inconsolata'";
	  this.c.fillText("Congratulations!", 65, 120);
	  this.c.font = "bold 30px 'Inconsolata'";
	  this.c.fillText("You've completed all the levels.", 65, 180);
	  this.c.font = "bold 24px 'Inconsolata'";
	  this.c.fillText("How's it feel?", 216, 300);
	};
	
	Renderer.prototype.getVisibleSquares = function (origin, currentLevel) {
	  var topRow = Math.floor(origin[1] / BLOCK_LENGTH);
	  if (topRow === -1) {
	    topRow = 0;
	  }
	  var bottomRow = Math.floor((origin[1] + BLOCK_LENGTH * 6 - 1) / BLOCK_LENGTH);
	  if (bottomRow >= this.game.currentLevel.foregroundGrid.length) {
	    bottomRow = this.game.currentLevel.foregroundGrid.length - 1;
	  }
	  var leftCol = Math.floor(origin[0] / BLOCK_LENGTH) - 1;
	  if (leftCol < 0) {
	    leftCol = 0;
	  }
	  var rightCol = Math.floor((origin[0] + BLOCK_LENGTH * 8 - 1) / BLOCK_LENGTH) + 1;
	  if (rightCol >= this.game.currentLevel.foregroundGrid[0].length) {
	    rightCol = this.game.currentLevel.foregroundGrid[0].length - 1;
	  }
	
	  return [topRow, leftCol, bottomRow, rightCol];
	};
	
	Renderer.prototype.renderForeground = function (origin, currentLevel, cornerSquares) {
	  var rowTopY = cornerSquares[0] * BLOCK_LENGTH;
	  for (var row = cornerSquares[0]; row <= cornerSquares[2]; row++) {
	    var colLeftX = cornerSquares[1] * BLOCK_LENGTH;
	    for (var col = cornerSquares[1]; col <= cornerSquares[3]; col++) {
	      var xBlock = -1 * origin[0] + colLeftX + 0.5;
	      var yBlock = -1 * origin[1] + rowTopY + 0.5;
	      if (currentLevel.foregroundGrid[row][col] === "block") {
	        this.drawBlock([xBlock, yBlock]);
	      } else if (currentLevel.foregroundGrid[row][col] === "platform") {
	        this.drawPlatform([xBlock, yBlock], '#2c2929', '#161515');
	      } else if (currentLevel.foregroundGrid[row][col].toString() === "door") {
	        this.drawDoor(currentLevel.foregroundGrid[row][col], [xBlock, yBlock]);
	      } else if (currentLevel.foregroundGrid[row][col].toString() === "ButtonBlock") {
	        this.drawButtonBlock(currentLevel.foregroundGrid[row][col], [xBlock, yBlock]);
	      } else if (currentLevel.foregroundGrid[row][col].toString() === "PowerSource") {
	        this.drawPowerBlock([xBlock, yBlock], currentLevel.foregroundGrid[row][col]);
	      } else if (currentLevel.foregroundGrid[row][col] === "powerBlock") {
	        this.drawPowerBlock([xBlock, yBlock], currentLevel.foregroundGrid[row][col]);
	      } else if (currentLevel.foregroundGrid[row][col].toString() === "ForceFieldBlock") {
	        this.drawForceFieldBlock([xBlock, yBlock], currentLevel.foregroundGrid[row][col]);
	      } else if (currentLevel.foregroundGrid[row][col].toString() === "forceField" && currentLevel.foregroundGrid[row - 1][col].toString() === "ForceFieldBlock" && currentLevel.foregroundGrid[row - 1][col].hasPower) {
	        this.drawForceField([xBlock, yBlock]);
	      } else if (currentLevel.foregroundGrid[row][col].toString() === "spring" && currentLevel.foregroundGrid[row][col].pickedUp === false) {
	        this.drawSpringPowerUp([xBlock, yBlock]);
	      }
	
	      colLeftX += 75;
	    }
	
	    rowTopY += 75;
	  }
	};
	
	Renderer.prototype.renderBackground = function (origin, currentLevel, cornerSquares) {
	  var rowTopY = cornerSquares[0] * BLOCK_LENGTH;
	  for (var row = cornerSquares[0]; row <= cornerSquares[2]; row++) {
	    var colLeftX = cornerSquares[1] * BLOCK_LENGTH;
	    for (var col = cornerSquares[1]; col <= cornerSquares[3]; col++) {
	      if (currentLevel.foregroundGrid[row][col] === "block") {
	        colLeftX += 75;
	        continue; //skip - there's a foreground block covering this square
	      }
	      var xBlock = -1 * origin[0] + colLeftX + 0.5;
	      var yBlock = -1 * origin[1] + rowTopY + 0.5;
	      if (currentLevel.backgroundGrid[row][col] === "brick") {
	        var leftEdges = currentLevel.foregroundGrid[row][col - 1] !== "block";
	        this.drawBrick([xBlock, yBlock], currentLevel.color, leftEdges);
	      }
	
	      colLeftX += 75;
	    }
	
	    rowTopY += 75;
	  }
	};
	
	Renderer.prototype.renderElevators = function (origin, currentLevel, cornerSquares) {
	  var colLeftX = cornerSquares[1] * BLOCK_LENGTH;
	  //iterate through each visible column:
	  for (var col = cornerSquares[1]; col <= cornerSquares[3]; col++) {
	    //iterate through elevators to see if there's one in this column:
	    for (var elv = 0; elv < currentLevel.elevators.length; elv++) {
	      if (currentLevel.elevators[elv].col === col) {
	        //if so, find where the top is:
	        var topRow = currentLevel.elevators[elv].topRow;
	        var additionalPixels = currentLevel.elevators[elv].additionalPixels;
	        var xBlock = -1 * origin[0] + colLeftX + 0.5;
	        var platformTopY = BLOCK_LENGTH * topRow - origin[1] + 0.5;
	        var adjustedPlatformTop = platformTopY - additionalPixels;
	        //and the bottom
	        var realBaseBottomY = (currentLevel.elevators[elv].baseRow + 1) * BLOCK_LENGTH + 0.5;
	        var relBaseBottomY = realBaseBottomY - origin[1];
	        this.drawElevator(xBlock, adjustedPlatformTop, relBaseBottomY, currentLevel.elevators[elv].exit);
	      }
	    }
	
	    colLeftX += 75;
	  }
	};
	
	Renderer.prototype.drawElevator = function (xBlock, adjustedPlatformTop, relBaseBottomY, exit) {
	  var COLUMN_WIDTH = 25;
	  var inset = Math.floor((BLOCK_LENGTH - COLUMN_WIDTH) / 2);
	  var columnTopY = adjustedPlatformTop + Math.floor(BLOCK_LENGTH / 3);
	  var height = relBaseBottomY - columnTopY;
	  if (450 - columnTopY < height) {
	    height = 450 - columnTopY;
	  }
	  var grad = this.c.createLinearGradient(xBlock + inset, 0, xBlock + inset + COLUMN_WIDTH, 0);
	  grad.addColorStop(0, '#1A1919');
	  grad.addColorStop(0.5, '#68625F');
	  grad.addColorStop(1, '#1A1919');
	  this.c.beginPath();
	  this.c.rect(xBlock + inset, columnTopY, COLUMN_WIDTH, height);
	  this.c.fillStyle = grad;
	  this.c.fill();
	  this.c.strokeStyle = '#000';
	  this.c.stroke();
	  if (exit) {
	    this.drawPlatform([xBlock, adjustedPlatformTop], 'red', '#440000');
	  } else {
	    this.drawPlatform([xBlock, adjustedPlatformTop], '#67480E', '#211705');
	  }
	};
	
	Renderer.prototype.renderBackgroundObjects = function (objects, origin, currentLevel, cornerSquares) {
	  for (var i = 0; i < objects.length; i++) {
	    if (objects[i].rowCol[0] >= cornerSquares[0] && objects[i].rowCol[1] >= cornerSquares[1] && objects[i].rowCol[0] <= cornerSquares[2] && objects[i].rowCol[1] <= cornerSquares[3]) {
	      var xBlock = BLOCK_LENGTH * objects[i].rowCol[1] - origin[0] + 0.5;
	      var yBlock = BLOCK_LENGTH * objects[i].rowCol[0] - origin[1] + 0.5;
	      if (objects[i] instanceof _wire2.default) {
	        this.drawWire([xBlock, yBlock], objects[i]);
	      } else if (objects[i] instanceof _wireJunction2.default) {
	        this.drawWireJunction([xBlock, yBlock], objects[i]);
	      } else if (objects[i] instanceof _cubby2.default) {
	        this.drawCubby([xBlock, yBlock], objects[i]);
	      }
	    }
	  }
	};
	
	Renderer.prototype.renderRobot = function (robot) {
	  var leftWheelCenter = [robot.pos[0] + 5, robot.pos[1] + BLOCK_LENGTH - 5];
	  var rightWheelCenter = [robot.pos[0] + BLOCK_LENGTH - 6, robot.pos[1] + BLOCK_LENGTH - 5];
	  var bottomBarTop = leftWheelCenter[1] - 6;
	  var headBottom = robot.pos[1] + 10 - robot.height + 54;
	  this.drawDot([robot.pos[0] + BLOCK_LENGTH / 2, bottomBarTop - (bottomBarTop - headBottom) / 4]);
	  this.drawDot([robot.pos[0] + 15, bottomBarTop - (bottomBarTop - headBottom) / 2]);
	  this.drawDot([robot.pos[0] + BLOCK_LENGTH - 15, bottomBarTop - (bottomBarTop - headBottom) / 2]);
	  this.drawDot([robot.pos[0] + BLOCK_LENGTH / 2, bottomBarTop - (bottomBarTop - headBottom) / 4 * 3]);
	  this.drawLine([robot.pos[0] + 15, bottomBarTop], [robot.pos[0] + BLOCK_LENGTH - 15, bottomBarTop - (bottomBarTop - headBottom) / 2]);
	  this.drawLine([robot.pos[0] + BLOCK_LENGTH - 15, bottomBarTop], [robot.pos[0] + 15, bottomBarTop - (bottomBarTop - headBottom) / 2]);
	  this.drawLine([robot.pos[0] + 15, bottomBarTop - (bottomBarTop - headBottom) / 2], [robot.pos[0] + BLOCK_LENGTH - 15, headBottom]);
	  this.drawLine([robot.pos[0] + BLOCK_LENGTH - 15, bottomBarTop - (bottomBarTop - headBottom) / 2], [robot.pos[0] + 15, headBottom]);
	  this.drawHead(robot);
	
	  //bottom bar:
	  this.drawRectangle({
	    x: leftWheelCenter[0],
	    y: bottomBarTop,
	    width: 60,
	    height: 5,
	    fill: 'yellow',
	    stroke: '#000'
	  });
	
	  //left arm:
	  this.drawRectangle({
	    x: robot.pos[0],
	    y: robot.pos[1] + 30,
	    width: 5,
	    height: 15,
	    fill: 'yellow',
	    stroke: '#000'
	  });
	  this.drawRectangle({
	    x: leftWheelCenter[0],
	    y: robot.pos[1] + 37,
	    width: 3,
	    height: 30,
	    fill: 'yellow',
	    stroke: '#000'
	  });
	
	  this.drawFullCircle({ //left wheel
	    pos: [leftWheelCenter[0], leftWheelCenter[1]],
	    radius: 5,
	    fill: '#000'
	  });
	
	  this.c.beginPath();
	  this.c.arc(leftWheelCenter[0], leftWheelCenter[1], 8, 1.5 * Math.PI, 2 * Math.PI, false);
	  this.c.lineTo(leftWheelCenter[0], leftWheelCenter[1]);
	  this.c.closePath();
	  this.c.fillStyle = 'yellow';
	  this.c.fill();
	  this.c.stroke();
	
	  //right arm:
	  this.drawRectangle({
	    x: robot.pos[0] + BLOCK_LENGTH - 6,
	    y: robot.pos[1] + 30,
	    width: 5,
	    height: 15,
	    fill: 'yellow',
	    stroke: '#000'
	  });
	  this.drawRectangle({
	    x: rightWheelCenter[0] - 3,
	    y: robot.pos[1] + 37,
	    width: 3,
	    height: 30,
	    fill: 'yellow',
	    stroke: '#000'
	  });
	
	  this.drawFullCircle({ //right wheel
	    pos: [rightWheelCenter[0], rightWheelCenter[1]],
	    radius: 5,
	    fill: '#000'
	  });
	
	  this.c.beginPath();
	  this.c.arc(rightWheelCenter[0], rightWheelCenter[1], 8, Math.PI, 1.5 * Math.PI, false);
	  this.c.lineTo(rightWheelCenter[0], rightWheelCenter[1]);
	  this.c.closePath();
	  this.c.fillStyle = 'yellow';
	  this.c.fill();
	  this.c.stroke();
	};
	
	Renderer.prototype.drawHead = function (robot) {
	  var x = robot.pos[0] + 10;
	  var y = robot.pos[1] + 10 - robot.height;
	  this.drawFrame({ x: x, y: y, width: 54, height: 54, thickness: 5, fill: 'yellow' });
	  var x2 = x + 5;
	  var y2 = y + 5;
	  if (robot.item) {
	    robot.item.render(this.c, [x2, y2], 44, false);
	  } else {
	    this.drawFrame({ x: x2, y: y2, width: 44, height: 44, thickness: 5, fill: '#8C8400' });
	    this.drawLine([x2, y2], [x2 + 5, y2 + 5]);
	    this.drawLine([x2, y2 + 44], [x2 + 5, y2 + 39]);
	    this.drawLine([x2 + 44, y2], [x2 + 39, y2 + 5]);
	    this.drawLine([x2 + 44, y2 + 44], [x2 + 39, y2 + 39]);
	  }
	};
	
	Renderer.prototype.drawDoor = function (door, pos) {
	  var TOOTH_HEIGHT = 8;
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
	    var doorHalfHeight = (BLOCK_LENGTH - 1 - openSpace) / 2;
	    if (doorHalfHeight < -1) {
	      doorHalfHeight = -1;
	    }
	    var negPercent = door.percentOpen - 1;
	    var negToothHeight = 0;
	    if (negPercent >= 0) {
	      negToothHeight = (BLOCK_LENGTH - 1) * negPercent / 2;
	    }
	
	    this.c.beginPath();
	    this.c.moveTo(topLeftCorner[0], topLeftCorner[1] - 1);
	    this.c.lineTo(topLeftCorner[0] + width, topLeftCorner[1] - 1);
	    this.c.lineTo(topLeftCorner[0] + width, topLeftCorner[1] + doorHalfHeight);
	    this.c.lineTo(topLeftCorner[0] + 4 / 5 * width, topLeftCorner[1] + doorHalfHeight);
	    var topHeight = topLeftCorner[1] + doorHalfHeight + TOOTH_HEIGHT - negToothHeight;
	    if (topHeight < topLeftCorner[1] - 1) {
	      topHeight = topLeftCorner[1] - 1;
	    }
	    this.c.lineTo(topLeftCorner[0] + 4 / 5 * width, topHeight);
	    this.c.lineTo(topLeftCorner[0] + 1 / 5 * width, topHeight);
	    this.c.lineTo(topLeftCorner[0] + 1 / 5 * width, topLeftCorner[1] + doorHalfHeight);
	    this.c.lineTo(topLeftCorner[0], topLeftCorner[1] + doorHalfHeight);
	    this.c.closePath();
	    this.c.fillStyle = door.color;
	    this.c.fill();
	    this.c.strokeStyle = 'black';
	    this.c.stroke();
	
	    this.c.beginPath();
	    this.c.moveTo(topLeftCorner[0], topLeftCorner[1] + BLOCK_LENGTH - 1 - doorHalfHeight);
	    this.c.lineTo(topLeftCorner[0] + 1 / 5 * width, topLeftCorner[1] + BLOCK_LENGTH - 1 - doorHalfHeight);
	    this.c.lineTo(topLeftCorner[0] + 1 / 5 * width, topLeftCorner[1] + BLOCK_LENGTH - 1 - doorHalfHeight + TOOTH_HEIGHT);
	    this.c.lineTo(topLeftCorner[0] + 4 / 5 * width, topLeftCorner[1] + BLOCK_LENGTH - 1 - doorHalfHeight + TOOTH_HEIGHT);
	    this.c.lineTo(topLeftCorner[0] + 4 / 5 * width, topLeftCorner[1] + BLOCK_LENGTH - 1 - doorHalfHeight);
	    this.c.lineTo(topLeftCorner[0] + width, topLeftCorner[1] + BLOCK_LENGTH - 1 - doorHalfHeight);
	    this.c.lineTo(topLeftCorner[0] + width, topLeftCorner[1] + BLOCK_LENGTH);
	    this.c.lineTo(topLeftCorner[0], topLeftCorner[1] + BLOCK_LENGTH);
	    this.c.closePath();
	    this.c.fillStyle = door.color;
	    this.c.fill();
	    this.c.strokeStyle = 'black';
	    this.c.stroke();
	  }
	};
	
	Renderer.prototype.drawPlatform = function (pos, topColor, bottomColor) {
	  var x = pos[0];
	  var y = pos[1];
	  var height = Math.floor(BLOCK_LENGTH / 3);
	  var grad = this.c.createLinearGradient(x, y, x, y + height);
	  grad.addColorStop(0, topColor);
	  grad.addColorStop(1, bottomColor);
	  this.drawRectangle({
	    x: x,
	    y: y,
	    width: BLOCK_LENGTH,
	    height: height,
	    fill: grad
	  });
	};
	
	Renderer.prototype.drawWireJunction = function (pos, wireJunction) {
	  if (wireJunction.segments["N"]) {
	    this.drawRectangle({ // N
	      x: pos[0] + BLOCK_LENGTH / 2 - 4.5,
	      y: pos[1] - 0.5,
	      width: 9,
	      height: BLOCK_LENGTH / 2 - 4.5,
	      fill: wireJunction.segments["N"].hasPower ? this.gradientArray[this.gradientIndex] : '#333',
	      stroke: 'none'
	    });
	  }
	  if (wireJunction.segments["E"]) {
	    this.drawRectangle({ // E
	      x: pos[0] + BLOCK_LENGTH / 2 + 4.5,
	      y: pos[1] + BLOCK_LENGTH / 2 - 4.5,
	      width: BLOCK_LENGTH / 2 - 4.5,
	      height: 9,
	      fill: wireJunction.segments["E"].hasPower ? this.gradientArray[this.gradientIndex] : '#333',
	      stroke: 'none'
	    });
	  }
	  if (wireJunction.segments["S"]) {
	    this.drawRectangle({ // S
	      x: pos[0] + BLOCK_LENGTH / 2 - 4.5,
	      y: pos[1] + BLOCK_LENGTH / 2 + 4.5,
	      width: 9,
	      height: BLOCK_LENGTH / 2 - 4.5,
	      fill: wireJunction.segments["S"].hasPower ? this.gradientArray[this.gradientIndex] : '#333',
	      stroke: 'none'
	    });
	  }
	  if (wireJunction.segments["W"]) {
	    this.drawRectangle({ // W
	      x: pos[0] - 0.5,
	      y: pos[1] + BLOCK_LENGTH / 2 - 4.5,
	      width: BLOCK_LENGTH / 2 - 4.5,
	      height: 9,
	      fill: wireJunction.segments["W"].hasPower ? this.gradientArray[this.gradientIndex] : '#333',
	      stroke: 'none'
	    });
	  }
	};
	
	Renderer.prototype.drawWire = function (pos, wire) {
	  var fill = wire.hasPower ? this.gradientArray[this.gradientIndex] : '#333';
	  if (wire.type === "EW") {
	    this.drawRectangle({
	      x: pos[0] - 0.5,
	      y: pos[1] + BLOCK_LENGTH / 2 - 4.5,
	      width: BLOCK_LENGTH + 0.5,
	      height: 9,
	      fill: fill,
	      stroke: 'none'
	    });
	  } else if (wire.type === "NS") {
	    this.drawRectangle({
	      x: pos[0] + BLOCK_LENGTH / 2 - 4.5,
	      y: pos[1] - 0.5,
	      width: 9,
	      height: BLOCK_LENGTH + 0.5,
	      fill: fill,
	      stroke: 'none'
	    });
	  } else if (wire.type === "ES") {
	    this.c.beginPath();
	    this.c.moveTo(pos[0] + BLOCK_LENGTH, pos[1] + BLOCK_LENGTH / 2 - 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 - 4.5, pos[1] + BLOCK_LENGTH / 2 - 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 - 4.5, pos[1] + BLOCK_LENGTH);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 + 4.5, pos[1] + BLOCK_LENGTH);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 + 4.5, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.closePath();
	    this.c.fillStyle = fill;
	    this.c.fill();
	  } else if (wire.type === "ESW") {
	    this.c.beginPath();
	    this.c.moveTo(pos[0] - 0.5, pos[1] + BLOCK_LENGTH / 2 - 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH, pos[1] + BLOCK_LENGTH / 2 - 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 + 4.5, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 + 4.5, pos[1] + BLOCK_LENGTH);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 - 4.5, pos[1] + BLOCK_LENGTH);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 - 4.5, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.lineTo(pos[0] - 0.5, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.closePath();
	    this.c.fillStyle = fill;
	    this.c.fill();
	  } else if (wire.type === "WS") {
	    this.c.beginPath();
	    this.c.moveTo(pos[0] - 0.5, pos[1] + BLOCK_LENGTH / 2 - 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 + 4.5, pos[1] + BLOCK_LENGTH / 2 - 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 + 4.5, pos[1] + BLOCK_LENGTH);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 - 4.5, pos[1] + BLOCK_LENGTH);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 - 4.5, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.lineTo(pos[0] - 0.5, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.closePath();
	    this.c.fillStyle = fill;
	    this.c.fill();
	  } else if (wire.type === "NE") {
	    this.c.beginPath();
	    this.c.moveTo(pos[0] + BLOCK_LENGTH / 2 - 4.5, pos[1] - 0.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 - 4.5, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH, pos[1] + BLOCK_LENGTH / 2 - 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 + 4.5, pos[1] + BLOCK_LENGTH / 2 - 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 + 4.5, pos[1] - 0.5);
	    this.c.fillStyle = fill;
	    this.c.fill();
	  } else if (wire.type === "NW") {
	    this.c.beginPath();
	    this.c.moveTo(pos[0] + BLOCK_LENGTH / 2 - 4.5, pos[1] - 0.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 - 4.5, pos[1] + BLOCK_LENGTH / 2 - 4.5);
	    this.c.lineTo(pos[0] - 0.5, pos[1] + BLOCK_LENGTH / 2 - 4.5);
	    this.c.lineTo(pos[0] - 0.5, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 + 4.5, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 + 4.5, pos[1] - 0.5);
	    this.c.fillStyle = fill;
	    this.c.fill();
	  } else if (wire.type === "NSW") {
	    this.drawRectangle({
	      x: pos[0] + BLOCK_LENGTH / 2 - 4.5,
	      y: pos[1] - 0.5,
	      width: 9,
	      height: BLOCK_LENGTH + 0.5,
	      fill: fill,
	      stroke: 'none'
	    });
	    this.c.beginPath();
	    this.c.moveTo(pos[0] - 0.5, pos[1] + BLOCK_LENGTH / 2 - 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2, pos[1] + BLOCK_LENGTH / 2 - 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.lineTo(pos[0] - 0.5, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.closePath();
	    this.c.fillStyle = fill;
	    this.c.fill();
	  } else if (wire.type === "NSE") {
	    this.drawRectangle({
	      x: pos[0] + BLOCK_LENGTH / 2 - 4.5,
	      y: pos[1] - 0.5,
	      width: 9,
	      height: BLOCK_LENGTH + 0.5,
	      fill: fill,
	      stroke: 'none'
	    });
	    this.c.beginPath();
	    this.c.moveTo(pos[0] + BLOCK_LENGTH / 2 + 4, pos[1] + BLOCK_LENGTH / 2 - 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH + 0.5, pos[1] + BLOCK_LENGTH / 2 - 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH + 0.5, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.lineTo(pos[0] + BLOCK_LENGTH / 2 + 4, pos[1] + BLOCK_LENGTH / 2 + 4.5);
	    this.c.closePath();
	    this.c.fillStyle = fill;
	    this.c.fill();
	  }
	};
	
	Renderer.prototype.drawCubby = function (pos, cubby) {
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
	  if (cubby.item) {
	    cubby.item.render(this.c, [x2, y2], 34, false);
	  } else {
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
	  }
	};
	
	Renderer.prototype.drawBrick = function (pos, color, leftEdges) {
	  var x = pos[0];
	  var y = pos[1];
	  var rowHeight = BLOCK_LENGTH / 4;
	  this.drawOuterSquare(pos, color, color);
	  this.c.strokeStyle = '#000';
	};
	
	Renderer.prototype.drawButtonBlock = function (buttonBlock, pos) {
	  this.drawPowerBlock(pos, buttonBlock.hasPower);
	  var buttonPanelX;
	  if (buttonBlock.side === "left") {
	    buttonPanelX = pos[0] - this.BUTTON_PANEL_WIDTH;
	  } else {
	    buttonPanelX = pos[0] + BLOCK_LENGTH - 1;
	  }
	  var buttonPanelY = pos[1] + (BLOCK_LENGTH - this.BUTTON_PANEL_HEIGHT) / 2 + 0.5;
	  var grad = this.c.createLinearGradient(buttonPanelX, buttonPanelY, buttonPanelX, buttonPanelY + this.BUTTON_PANEL_HEIGHT);
	  grad.addColorStop(0, '#858181');
	  grad.addColorStop(1, '#434242');
	  this.drawRectangle({
	    x: buttonPanelX,
	    y: buttonPanelY,
	    width: this.BUTTON_PANEL_WIDTH,
	    height: this.BUTTON_PANEL_HEIGHT,
	    fill: grad
	  });
	  var BUTTON_WIDTH = 5;
	  var BUTTON_HEIGHT = 8;
	  var buttonX;
	  if (buttonBlock.side === "left") {
	    buttonX = buttonPanelX - BUTTON_WIDTH;
	  } else {
	    buttonX = buttonPanelX + this.BUTTON_PANEL_WIDTH;
	  }
	  this.drawRectangle({
	    x: buttonX,
	    y: buttonPanelY + (this.BUTTON_PANEL_HEIGHT - BUTTON_HEIGHT) / 2,
	    width: BUTTON_WIDTH,
	    height: BUTTON_HEIGHT,
	    fill: buttonBlock.color
	  });
	};
	
	Renderer.prototype.drawSpringPowerUp = function (pos) {
	  this.drawRectangle({
	    x: pos[0] + 25,
	    y: pos[1] + 15,
	    fill: 'yellow',
	    width: 25,
	    height: 5
	  });
	  this.drawRectangle({
	    x: pos[0] + 25,
	    y: pos[1] + 15 + 40,
	    fill: 'yellow',
	    width: 25,
	    height: 5
	  });
	  var rightMiddleDotPos = [pos[0] + 25 + 12.5 + 8, pos[1] + 15 + 5 + 17.5];
	  var leftMiddleDotPos = [pos[0] + 25 + 4.5, pos[1] + 15 + 5 + 17.5];
	  this.drawDot([pos[0] + 25 + 12.5, pos[1] + 15 + 5 + 8.75]);
	  this.drawDot(leftMiddleDotPos);
	  this.drawDot(rightMiddleDotPos);
	  this.drawDot([pos[0] + 25 + 12.5, pos[1] + 15 + 5 + 26.25]);
	  this.drawLine([pos[0] + 25 + 4.5, pos[1] + 15 + 5], rightMiddleDotPos);
	  this.drawLine([pos[0] + 25 + 12.5 + 8, pos[1] + 15 + 5], leftMiddleDotPos);
	  this.drawLine(rightMiddleDotPos, [leftMiddleDotPos[0], pos[1] + 15 + 5 + 35]);
	  this.drawLine(leftMiddleDotPos, [rightMiddleDotPos[0], pos[1] + 15 + 5 + 35]);
	};
	
	Renderer.prototype.drawForceFieldBlock = function (pos, FFBlock) {
	  this.drawPowerBlock(pos, FFBlock.hasPower);
	  var shellColor = '#D5D4C9';
	  this.drawForceEmitter([pos[0] + 4, pos[1] + BLOCK_LENGTH - 1], shellColor);
	  this.drawForceEmitter([pos[0] + 27, pos[1] + BLOCK_LENGTH - 1], shellColor);
	  this.drawForceEmitter([pos[0] + 47, pos[1] + BLOCK_LENGTH - 1], shellColor);
	  this.drawForceEmitter([pos[0] + 70, pos[1] + BLOCK_LENGTH - 1], shellColor);
	};
	
	Renderer.prototype.drawForceEmitter = function (pos, fill) {
	  this.c.beginPath();
	  this.c.arc(pos[0], pos[1], 4, Math.PI, 2 * Math.PI, false);
	  this.c.closePath();
	  this.c.fillStyle = fill;
	  this.c.fill();
	  this.c.stroke();
	};
	
	Renderer.prototype.drawForceField = function (pos) {
	  this.drawForceLine([pos[0] + 4, pos[1]]);
	  this.drawForceLine([pos[0] + 27, pos[1]]);
	  this.drawForceLine([pos[0] + 47, pos[1]]);
	  this.drawForceLine([pos[0] + 70, pos[1]]);
	};
	
	Renderer.prototype.drawForceLine = function (pos) {
	  var fill = this.seconds % 2 === 0 ? '#fff' : 'blue';
	  this.drawRectangle({
	    x: pos[0] - 2,
	    y: pos[1],
	    width: 4,
	    height: BLOCK_LENGTH,
	    fill: fill,
	    stroke: 'none'
	  });
	};
	
	Renderer.prototype.drawPowerBlock = function (pos, power) {
	  var grad = power ? this.gradientArray[this.gradientIndex] : '#333';
	  this.drawOuterSquare(pos, '#000', grad);
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
	  var TRI_LENGTH = 40;
	  var START_TRIANGLE = EDGE_TO_INNER + (INNER_RECT_LENGTH - TRI_LENGTH) / 2;
	  //left triangle
	  this.c.fillStyle = backGrad;
	  this.c.beginPath();
	  this.c.moveTo(x + EDGE_TO_INNER, y + START_TRIANGLE);
	  this.c.lineTo(x + EDGE_TO_INNER, y + START_TRIANGLE + TRI_LENGTH);
	  this.c.lineTo(x + EDGE_TO_INNER + TRI_LENGTH / 2, y + START_TRIANGLE + TRI_LENGTH / 2);
	  this.c.closePath();
	  this.c.fill();
	  this.c.stroke();
	  //top triangle
	  this.c.beginPath();
	  this.c.moveTo(x + START_TRIANGLE, y + EDGE_TO_INNER);
	  this.c.lineTo(x + START_TRIANGLE + TRI_LENGTH, y + EDGE_TO_INNER);
	  this.c.lineTo(x + START_TRIANGLE + TRI_LENGTH / 2, y + EDGE_TO_INNER + TRI_LENGTH / 2);
	  this.c.closePath();
	  this.c.fill();
	  this.c.stroke();
	  //right triangle
	  this.c.beginPath();
	  this.c.moveTo(x + BLOCK_LENGTH - EDGE_TO_INNER, y + START_TRIANGLE);
	  this.c.lineTo(x + BLOCK_LENGTH - EDGE_TO_INNER, y + START_TRIANGLE + TRI_LENGTH);
	  this.c.lineTo(x + BLOCK_LENGTH - EDGE_TO_INNER - TRI_LENGTH / 2, y + START_TRIANGLE + TRI_LENGTH / 2);
	  this.c.closePath();
	  this.c.fill();
	  this.c.stroke();
	  //bottom triangle
	  this.c.beginPath();
	  this.c.moveTo(x + START_TRIANGLE, y + BLOCK_LENGTH - EDGE_TO_INNER);
	  this.c.lineTo(x + START_TRIANGLE + TRI_LENGTH, y + BLOCK_LENGTH - EDGE_TO_INNER);
	  this.c.lineTo(x + START_TRIANGLE + TRI_LENGTH / 2, y + BLOCK_LENGTH - EDGE_TO_INNER - TRI_LENGTH / 2);
	  this.c.closePath();
	  this.c.fill();
	  this.c.stroke();
	};
	
	Renderer.prototype.drawOuterSquare = function (pos, stroke, fill) {
	  this.drawRectangle({
	    x: pos[0],
	    y: pos[1],
	    width: BLOCK_LENGTH - 1,
	    height: BLOCK_LENGTH - 1,
	    stroke: stroke,
	    fill: fill
	  });
	};
	
	Renderer.prototype.drawDot = function (pos) {
	  this.drawFullCircle({
	    pos: pos,
	    fill: 'black',
	    radius: 2
	  });
	};
	
	Renderer.prototype.blackBackground = function () {
	  this.drawRectangle({
	    x: 0,
	    y: 0,
	    width: 600,
	    height: 450,
	    fill: 'black'
	  });
	};
	
	Renderer.prototype.drawFullCircle = function (options) {
	  this.c.beginPath();
	  this.c.arc(options.pos[0], options.pos[1], options.radius, 0, 2 * Math.PI, false);
	  this.c.fillStyle = options.fill;
	  this.c.fill();
	};
	
	Renderer.prototype.drawLine = function (start, finish) {
	  this.c.beginPath();
	  this.c.moveTo(start[0], start[1]);
	  this.c.lineTo(finish[0], finish[1]);
	  this.c.lineWidth = 1;
	  this.c.stroke();
	};
	
	Renderer.prototype.drawRectangle = function (object) {
	  var x = object.x;
	  var y = object.y;
	  var width = object.width;
	  var height = object.height;
	  var stroke = object.stroke || '#000';
	  var fill = object.fill || undefined;
	  this.c.globalAlpha = object.alpha || 1;
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
	  this.c.rect(x + thickness, y + thickness, width - thickness * 2, height - thickness * 2);
	  this.c.strokeStyle = stroke;
	  this.c.stroke();
	};
	
	Renderer.prototype.incrementDoors = function () {
	  this.game.currentLevel.doors.forEach(function (door) {
	    if (door.status === "opening") {
	      door.percentOpen = door.percentOpen + 0.02;
	      if (door.percentOpen >= 1.5) {
	        door.status = "open";
	      }
	    } else if (door.status === "closing") {
	      door.percentOpen = door.percentOpen - 0.02;
	      if (door.percentOpen <= 0) {
	        door.status = "closed";
	      }
	    }
	  });
	};
	
	Renderer.prototype.incrementGradientIndex = function () {
	  this.gradientIndex = this.gradientIndex + 1 * this.gradientSign;
	  if (this.gradientIndex === this.gradientArray.length) {
	    this.gradientSign = -1;
	    this.gradientIndex = this.gradientArray.length - 2;
	  } else if (this.gradientIndex === -1) {
	    this.gradientSign = 1;
	    this.gradientIndex = 1;
	  }
	};
	
	Renderer.prototype.incrementTime = function () {
	  this.seconds += 1;
	  if (this.seconds > 100) {
	    this.seconds = 0;
	  }
	  if (this.game.levelFlashSeconds > 0) {
	    this.game.levelFlashSeconds -= 1;
	  }
	};
	
	Renderer.prototype.fillGradientArray = function (rgbColor, arrayLength) {
	  var returnArray = [rgbColor];
	  for (var i = 0; i < arrayLength; i++) {
	    rgbColor = this.shadeRGBColor(rgbColor, -0.02);
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
	  return "rgb(" + (Math.round((t - R) * p) + R) + "," + (Math.round((t - G) * p) + G) + "," + (Math.round((t - B) * p) + B) + ")";
	};
	
	module.exports = Renderer;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _powerObject = __webpack_require__(22);
	
	var _powerObject2 = _interopRequireDefault(_powerObject);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Wire = function (_PowerObject) {
	  _inherits(Wire, _PowerObject);
	
	  function Wire(options) {
	    _classCallCheck(this, Wire);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Wire).call(this, options));
	
	    _this.type = options.type;
	    return _this;
	  }
	
	  return Wire;
	}(_powerObject2.default);
	
	module.exports = Wire;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _wireSegment = __webpack_require__(4);
	
	var _wireSegment2 = _interopRequireDefault(_wireSegment);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var WireJunction = function () {
	  function WireJunction(options) {
	    _classCallCheck(this, WireJunction);
	
	    this.id = options.id;
	    this.rowCol = options.rowCol;
	    this.segmentStrings = options.segmentStrings;
	    this.segments = {};
	    for (var i = 0; i < this.segmentStrings.length; i++) {
	      if (this.segmentStrings[i] === "N") {
	        this.segments['N'] = new _wireSegment2.default({ id: "N" });
	      } else if (this.segmentStrings[i] === "E") {
	        this.segments['E'] = new _wireSegment2.default({ id: "E" });
	      } else if (this.segmentStrings[i] === "S") {
	        this.segments['S'] = new _wireSegment2.default({ id: "S" });
	      } else if (this.segmentStrings[i] === "W") {
	        this.segments['W'] = new _wireSegment2.default({ id: "W" });
	      }
	    }
	  }
	
	  _createClass(WireJunction, [{
	    key: 'sendPower',
	    value: function sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, flowing) {
	      var cubby;
	      for (var _i = 0; _i < cubbies.length; _i++) {
	        if (cubbies[_i].rowCol[0] === this.rowCol[0] && cubbies[_i].rowCol[1] === this.rowCol[1]) {
	          cubby = cubbies[_i];
	          break;
	        }
	      }
	
	      if (flowing === "leftward" && this.segments['E']) {
	        this.segments['E'].hasPower = true;
	        this.giveItemPower(cubby.item, 'E');
	      } else if (flowing === "rightward" && this.segments['W']) {
	        this.segments['W'].hasPower = true;
	        this.giveItemPower(cubby.item, 'W');
	      } else if (flowing === "upward" && this.segments['S']) {
	        this.giveItemPower(cubby.item, 'S');
	        this.segments['S'].hasPower = true;
	      } else if (flowing === "downward" && this.segments['N']) {
	        this.giveItemPower(cubby.item, 'N');
	        this.segments['N'].hasPower = true;
	      }
	
	      if (cubby.item) {
	        if (cubby.item.hasPower) {
	          for (var i = 0; i < cubby.item.segments.length; i++) {
	            if (this.segments[cubby.item.segments[i]]) {
	              this.segments[cubby.item.segments[i]].hasPower = true;
	            }
	          }
	          this.sendPowerFromItem(cubby.item, wiring, cubbies, buttonBlocks, forceFieldBlocks, flowing);
	        }
	      }
	    }
	  }, {
	    key: 'giveItemPower',
	    value: function giveItemPower(item, side) {
	      if (item && item.segments.indexOf(side) !== -1) {
	        item.hasPower = true;
	      }
	    }
	  }, {
	    key: 'sendPowerFromItem',
	    value: function sendPowerFromItem(item, wiring, cubbies, buttonBlocks, forceFieldBlocks, flowing) {
	
	      var topRowCol = [this.rowCol[0] - 1, this.rowCol[1]];
	      var leftRowCol = [this.rowCol[0], this.rowCol[1] - 1];
	      var rightRowCol = [this.rowCol[0], this.rowCol[1] + 1];
	      var bottomRowCol = [this.rowCol[0] + 1, this.rowCol[1]];
	
	      //look through wires:
	      for (var _i2 = 0; _i2 < wiring.length; _i2++) {
	        if (item.segments.indexOf("W") !== -1 && this.segments["W"] && wiring[_i2].rowCol[0] === leftRowCol[0] && wiring[_i2].rowCol[1] === leftRowCol[1] && flowing !== "rightward") {
	          wiring[_i2].hasPower = true;
	          wiring[_i2].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "leftward");
	        }
	        if (item.segments.indexOf("N") !== -1 && this.segments["N"] && wiring[_i2].rowCol[0] === topRowCol[0] && wiring[_i2].rowCol[1] === topRowCol[1] && flowing !== "downward") {
	          wiring[_i2].hasPower = true;
	          wiring[_i2].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "upward");
	        }
	        if (item.segments.indexOf("E") !== -1 && this.segments["E"] && wiring[_i2].rowCol[0] === rightRowCol[0] && wiring[_i2].rowCol[1] === rightRowCol[1] && flowing !== "leftward") {
	          wiring[_i2].hasPower = true;
	          wiring[_i2].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "rightward");
	        }
	        if (item.segments.indexOf("S") !== -1 && this.segments["S"] && wiring[_i2].rowCol[0] === bottomRowCol[0] && wiring[_i2].rowCol[1] === bottomRowCol[1] && flowing !== "upward") {
	          wiring[_i2].hasPower = true;
	          wiring[_i2].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "downward");
	        }
	      }
	
	      //look through button blocks:
	      for (var _i3 = 0; _i3 < buttonBlocks.length; _i3++) {
	        if (buttonBlocks[_i3].rowCol[0] === leftRowCol[0] && buttonBlocks[_i3].rowCol[1] === leftRowCol[1]) {
	          buttonBlocks[_i3].hasPower = true;
	        }
	        if (buttonBlocks[_i3].rowCol[0] === topRowCol[0] && buttonBlocks[_i3].rowCol[1] === topRowCol[1]) {
	          buttonBlocks[_i3].hasPower = true;
	        }
	        if (buttonBlocks[_i3].rowCol[0] === rightRowCol[0] && buttonBlocks[_i3].rowCol[1] === rightRowCol[1]) {
	          buttonBlocks[_i3].hasPower = true;
	        }
	        if (buttonBlocks[_i3].rowCol[0] === bottomRowCol[0] && buttonBlocks[_i3].rowCol[1] === bottomRowCol[1]) {
	          buttonBlocks[_i3].hasPower = true;
	        }
	      }
	
	      //look through force field blocks:
	      for (var i = 0; i < forceFieldBlocks.length; i++) {
	        if (item.segments.indexOf("W") !== -1 && this.segments["W"] && forceFieldBlocks[i].rowCol[0] === leftRowCol[0] && forceFieldBlocks[i].rowCol[1] === leftRowCol[1]) {
	          forceFieldBlocks[i].hasPower = true;
	        }
	        if (item.segments.indexOf("N") !== -1 && this.segments["N"] && forceFieldBlocks[i].rowCol[0] === topRowCol[0] && forceFieldBlocks[i].rowCol[1] === topRowCol[1]) {
	          forceFieldBlocks[i].hasPower = true;
	        }
	        if (item.segments.indexOf("E") !== -1 && this.segments["E"] && forceFieldBlocks[i].rowCol[0] === rightRowCol[0] && forceFieldBlocks[i].rowCol[1] === rightRowCol[1]) {
	          forceFieldBlocks[i].hasPower = true;
	        }
	        if (item.segments.indexOf("S") !== -1 && this.segments["S"] && forceFieldBlocks[i].rowCol[0] === bottomRowCol[0] && forceFieldBlocks[i].rowCol[1] === bottomRowCol[1]) {
	          forceFieldBlocks[i].hasPower = true;
	        }
	      }
	    }
	  }]);
	
	  return WireJunction;
	}();
	
	module.exports = WireJunction;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var WireSegment = function WireSegment(options) {
	  _classCallCheck(this, WireSegment);
	
	  this.id = options.id;
	  this.hasPower = false;
	};
	
	module.exports = WireSegment;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Robot = function Robot(startingPos) {
	  _classCallCheck(this, Robot);
	
	  this.pos = startingPos;
	  this.speed = 256;
	  this.height = 0;
	  this.maxHeight = 0;
	};
	
	module.exports = Robot;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Door = function () {
	  function Door(id, side, color) {
	    _classCallCheck(this, Door);
	
	    this.id = id;
	    this.status = "closed";
	    this.percentOpen = 0;
	    this.aniFrame = undefined;
	    this.side = side;
	    this.color = color || 'red';
	  }
	
	  _createClass(Door, [{
	    key: "toString",
	    value: function toString() {
	      return "door";
	    }
	  }, {
	    key: "open",
	    value: function open() {
	      if (this.status !== "open") {
	        this.status = "opening";
	      }
	    }
	  }, {
	    key: "close",
	    value: function close() {
	      if (this.status !== "closed") {
	        this.status = "closing";
	      }
	    }
	  }]);
	
	  return Door;
	}();
	
	module.exports = Door;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _powerObject = __webpack_require__(22);
	
	var _powerObject2 = _interopRequireDefault(_powerObject);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var ButtonBlock = function (_PowerObject) {
	  _inherits(ButtonBlock, _PowerObject);
	
	  function ButtonBlock(options) {
	    _classCallCheck(this, ButtonBlock);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ButtonBlock).call(this, options));
	
	    _this.side = options.side;
	    _this.pushFunc = options.func;
	    _this.color = options.color || 'red';
	    return _this;
	  }
	
	  return ButtonBlock;
	}(_powerObject2.default);
	
	module.exports = ButtonBlock;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Cubby = function Cubby(options) {
	  _classCallCheck(this, Cubby);
	
	  this.id = options.id;
	  this.rowCol = options.rowCol;
	  this.item = options.startItem;
	};
	
	module.exports = Cubby;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _renderer = __webpack_require__(1);
	
	var _renderer2 = _interopRequireDefault(_renderer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Panel = function () {
	  function Panel(segments) {
	    _classCallCheck(this, Panel);
	
	    this.segments = segments || [];
	    this.hasPower = false;
	  }
	
	  _createClass(Panel, [{
	    key: 'render',
	    value: function render(context, pos, length, power) {
	      var thickness = length / 3;
	      var x = pos[0];
	      var y = pos[1];
	      context.beginPath();
	      context.rect(x, y, length, length);
	      context.fillStyle = '#333';
	      context.fill();
	      context.strokeStyle = '#000';
	      context.stroke();
	
	      switch (this.segments.join("")) {
	        case "EW":
	          y += length / 2 - thickness / 2 + 0.5;
	          context.beginPath();
	          context.rect(x, y, length, thickness);
	          break;
	        case "NS":
	          x += length / 2 - thickness / 2 + 0.5;
	          context.beginPath();
	          context.rect(x, y, thickness, length);
	          break;
	        case "SW":
	          y += length / 2 - thickness / 2 + 0.5;
	          context.beginPath();
	          context.moveTo(x, y);
	          context.lineTo(x += length / 2 + thickness / 2 + 0.5, y);
	          context.lineTo(x, y += thickness / 2 + length / 2 - 0.5);
	          context.lineTo(x -= thickness, y);
	          context.lineTo(x, y -= length / 2 - thickness / 2 - 0.5);
	          context.lineTo(x -= length / 2 - thickness / 2 + 0.5, y);
	          context.closePath();
	          break;
	        case "NE":
	          x += length / 2 - thickness / 2 + 0.5;
	          context.beginPath();
	          context.moveTo(x, y);
	          context.lineTo(x, y += thickness / 2 + length / 2 - 0.5);
	          context.lineTo(x += length / 2 + thickness / 2 - 0.5, y);
	          context.lineTo(x, y -= thickness);
	          context.lineTo(x -= length / 2 - thickness / 2, y);
	          context.lineTo(x, y -= length / 2 - thickness / 2 - 0.5);
	          context.closePath();
	          break;
	        case "ESW":
	          y += length / 2 - thickness / 2 + 0.5;
	          context.beginPath();
	          context.moveTo(x, y);
	          context.lineTo(x += length, y);
	          context.lineTo(x, y += thickness);
	          context.lineTo(x -= length / 2 - thickness / 2, y);
	          context.lineTo(x, y += length / 2 - thickness / 2 - 0.5);
	          context.lineTo(x -= length / 2 - thickness / 2, y);
	          context.lineTo(x, y -= length / 2 - thickness / 2);
	          context.lineTo(x -= length / 2 - thickness / 2, y);
	          context.closePath();
	          break;
	        case "ENW":
	          y += length / 2 - thickness / 2 + 0.5;
	          context.beginPath();
	          context.moveTo(x, y);
	          context.lineTo(x += length / 2 - thickness / 2 + 0.5, y);
	          context.lineTo(x, y -= length / 2 - thickness / 2 + 0.5);
	          context.lineTo(x += thickness, y);
	          context.lineTo(x, y += length / 2 - thickness / 2 + 0.5);
	          context.lineTo(x += length / 2 - thickness / 2 - 0.5, y);
	          context.lineTo(x, y += thickness);
	          context.lineTo(x -= length, y);
	          context.closePath();
	          break;
	      }
	      context.fillStyle = '#484848';
	      context.fill();
	      context.strokeStyle = '#000';
	      context.stroke();
	    }
	  }]);
	
	  return Panel;
	}();
	
	module.exports = Panel;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _robot = __webpack_require__(5);
	
	var _robot2 = _interopRequireDefault(_robot);
	
	var _renderer = __webpack_require__(1);
	
	var _renderer2 = _interopRequireDefault(_renderer);
	
	var _wire = __webpack_require__(2);
	
	var _wire2 = _interopRequireDefault(_wire);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var BLOCK_LENGTH = 75;
	
	var Game = function () {
	  function Game(renderer, levelSequence) {
	    _classCallCheck(this, Game);
	
	    this.renderer = renderer;
	    this.BLOCK_LENGTH = 75;
	    this.levelSequence = levelSequence;
	    this.origin = [0, 0];
	    this.keysDown = {};
	    this.spaceTime = 0;
	    this.mainLoopRunning = false;
	    this.tutorialPage = 0;
	  }
	
	  _createClass(Game, [{
	    key: 'startGame',
	    value: function startGame() {
	      this.status = "loading";
	      this.renderer.displayLoadScreen();
	    }
	  }, {
	    key: 'showMainMenu',
	    value: function showMainMenu() {
	      this.status = "menu";
	      this.renderer.displayMenu();
	    }
	  }, {
	    key: 'startLevel',
	    value: function startLevel() {
	      var _this = this;
	
	      this.currentLevel = this.levelSequence[0];
	      if (this.currentLevel.name) {
	        (function () {
	          _this.renderer.showLevelName = true;
	          var flashN = 5;
	          var levelFlash = window.setInterval(function () {
	            flashN = _this.renderer.toggleLevelName(flashN);
	            if (flashN === 0) {
	              clearInterval(levelFlash);
	            }
	          }, 600);
	        })();
	      }
	      this.levelWidth = this.currentLevel.backgroundGrid[0].length * this.BLOCK_LENGTH;
	      this.levelHeight = this.currentLevel.backgroundGrid.length * this.BLOCK_LENGTH;
	      if (this.currentLevel.backgroundGrid.length !== this.currentLevel.foregroundGrid.length || this.currentLevel.backgroundGrid[0].length !== this.currentLevel.foregroundGrid[0].length) {
	        throw "foregroundGrid and backgroundGrid dimensions don't match!";
	      }
	
	      var robotX, robotY;
	      if (this.currentLevel.startingPos[0] - 263.5 < 0) {
	        this.origin[0] = 0;
	        robotX = this.currentLevel.startingPos[0];
	      } else {
	        this.origin[0] = this.currentLevel.startingPos[0] - 263.5;
	        robotX = 263.5;
	      }
	      if (this.currentLevel.startingPos[1] - 187.5 < 0) {
	        this.origin[1] = 0;
	        robotY = this.currentLevel.startingPos[1];
	      } else if (this.currentLevel.foregroundGrid.length * BLOCK_LENGTH - this.currentLevel.startingPos[1] < 187.5) {
	        this.origin[1] = this.currentLevel.foregroundGrid.length * BLOCK_LENGTH - 450;
	        robotY = this.currentLevel.startingPos[1] - this.origin[1];
	      } else {
	        this.origin[1] = this.currentLevel.startingPos[1] - 187.5;
	        robotY = 187.5;
	      }
	      this.robot = new _robot2.default([robotX, robotY]);
	      this.status = "inControl";
	      this.updatePower();
	      if (this.mainLoopRunning === false) {
	        this.mainLoopRunning = true;
	        this.main(Date.now());
	      }
	    }
	  }, {
	    key: 'advanceLevel',
	    value: function advanceLevel() {
	      this.levelSequence.shift();
	      if (this.levelSequence.length === 0) {
	        this.status = "end screen";
	      } else {
	        this.startLevel();
	      }
	    }
	  }, {
	    key: 'main',
	    value: function main(passedThen) {
	      var _this2 = this;
	
	      if (this.spaceTime > 0) {
	        this.spaceTime -= 1;
	      }
	      var now = Date.now();
	      var delta = now - passedThen;
	      this.update(delta / 1000);
	      this.renderer.renderScreen();
	      var newThen = now;
	      window.requestAnimationFrame(function () {
	        _this2.main(newThen);
	      });
	    }
	  }, {
	    key: 'update',
	    value: function update(modifier) {
	      var realArrays = [this.origin, this.robot.pos];
	      var topRow = this.getTopRow(realArrays);
	      var bottomRow = this.getBottomRow(realArrays);
	      var leftCol = this.getLeftColumn(realArrays);
	      var rightCol = this.getRightColumn(realArrays);
	      var ghostArrays = [this.origin, this.robot.pos];
	      var aboveTopObj = null;
	      var topObj = null;
	      var bottomObj = null;
	
	      if (this.status === "rising" || this.status === "finished") {
	        ghostArrays = this.moveUp(this.elevatorArray[0].speed, modifier);
	        this.elevatorArray.forEach(function (elevator) {
	          elevator.additionalPixels += elevator.speed * modifier;
	        });
	      } else if (this.status === "descending") {
	        ghostArrays = this.moveDown(this.elevatorArray[0].speed, modifier);
	        this.elevatorArray.forEach(function (elevator) {
	          elevator.additionalPixels -= elevator.speed * modifier;
	        });
	      } else if (this.status === "inControl") {
	        this.checkForSpring(topRow, bottomRow, leftCol, rightCol);
	        if (38 in this.keysDown) {
	          //up
	          this.handleVerticalKeys(leftCol, rightCol, topRow, bottomRow, "up");
	        } else if (40 in this.keysDown) {
	          //down
	          this.handleVerticalKeys(leftCol, rightCol, topRow, bottomRow, "down");
	        }
	        if (39 in this.keysDown) {
	          //right
	          ghostArrays = this.moveRight(this.robot.speed, modifier);
	          var ghostCol = this.getRightColumn(ghostArrays);
	          aboveTopObj = this.currentLevel.foregroundGrid[topRow - 1][ghostCol];
	          topObj = this.currentLevel.foregroundGrid[topRow][ghostCol];
	          bottomObj = this.currentLevel.foregroundGrid[bottomRow][ghostCol];
	          var bottomRightObj = this.currentLevel.foregroundGrid[bottomRow][ghostCol + 1];
	          if (this.passThrough(topObj, aboveTopObj, "right") === false || this.passThrough(bottomObj, topObj, "right") === false) {
	            var robotX = this.getRealRightX(realArrays);
	            edge = 0.5 + ghostCol * this.BLOCK_LENGTH - 1;
	            var difference = edge - robotX;
	            ghostArrays = this.moveRight(difference, 1);
	          } else if (bottomRightObj.toString() === "ButtonBlock") {
	            var _buttonStuff = this.getLeftButtonEdge(ghostArrays);
	            if (_buttonStuff !== -1) {
	              edge = _buttonStuff[0];
	              var _button = _buttonStuff[1];
	              var _robotX = this.getRealRightX(realArrays);
	              var _difference = edge - _robotX;
	              ghostArrays = this.moveRight(_difference, 1);
	              if (_button.hasPower) {
	                _button.pushFunc(_button);
	              }
	            }
	          } else if (bottomObj.toString() === "door") {
	            edge = this.getLeftDoorEdge(ghostArrays, bottomObj);
	            if (edge !== -1) {
	              var _robotX2 = this.getRealRightX(realArrays);
	              var _difference2 = _robotX2 - edge;
	              if (_difference2 > 0) {
	                ghostArrays = this.moveLeft(_difference2, 1);
	              }
	            }
	          }
	        } else if (37 in this.keysDown) {
	          //left
	          ghostArrays = this.moveLeft(this.robot.speed, modifier);
	          var _ghostCol = this.getLeftColumn(ghostArrays);
	          aboveTopObj = this.currentLevel.foregroundGrid[topRow - 1][_ghostCol];
	          topObj = this.currentLevel.foregroundGrid[topRow][_ghostCol];
	          bottomObj = this.currentLevel.foregroundGrid[bottomRow][_ghostCol];
	          var bottomLeftObj = this.currentLevel.foregroundGrid[bottomRow][_ghostCol - 1];
	          if (this.passThrough(topObj, aboveTopObj, "left") === false || this.passThrough(bottomObj, topObj, "left") === false) {
	            var _robotX3 = this.getRealLeftX(realArrays);
	            edge = 0.5 + (_ghostCol + 1) * this.BLOCK_LENGTH;
	            var _difference3 = _robotX3 - edge;
	            ghostArrays = this.moveLeft(_difference3, 1);
	          } else if (bottomLeftObj.toString() === "ButtonBlock") {
	            var buttonStuff = this.getRightButtonEdge(ghostArrays);
	            if (buttonStuff !== -1) {
	              var edge = buttonStuff[0];
	              var button = buttonStuff[1];
	              var _robotX4 = this.getRealLeftX(realArrays);
	              var _difference4 = _robotX4 - edge;
	              ghostArrays = this.moveLeft(_difference4, 1);
	              if (button.hasPower) {
	                button.pushFunc(button);
	              }
	            }
	          } else if (bottomObj.toString() === "door") {
	            edge = this.getRightDoorEdge(ghostArrays, bottomObj);
	            if (edge !== -1) {
	              var _robotX5 = this.getRealLeftX(realArrays);
	              var _difference5 = edge - _robotX5;
	              if (_difference5 > 0) {
	                ghostArrays = this.moveRight(_difference5, 1);
	              }
	            }
	          }
	        } else if (32 in this.keysDown && this.spaceTime === 0) {
	          //space
	          this.spaceTime = 20;
	          var robotLeft = this.getRealLeftX(realArrays);
	          var leftColumn = this.getLeftColumn(realArrays);
	          var leftEdge = this.BLOCK_LENGTH * leftColumn + 0.5;
	          var distanceToLeftEdge = robotLeft - leftEdge;
	          if (distanceToLeftEdge <= 15) {
	            var cubby = this.cubbyAt([topRow, leftColumn]);
	            if (cubby && this.heightCloseEnough()) {
	              this.moveLeft(distanceToLeftEdge, 1);
	              this.swapCubbyItem(cubby);
	            }
	          } else {
	            var robotRight = this.getRealRightX(realArrays);
	            var rightColumn = this.getRightColumn(realArrays);
	            var rightEdge = this.BLOCK_LENGTH * (rightColumn + 1);
	            var distanceToRightEdge = rightEdge - robotRight;
	            if (distanceToRightEdge <= 15) {
	              var _cubby = this.cubbyAt([topRow, rightColumn]);
	              if (_cubby && this.heightCloseEnough()) {
	                this.moveRight(distanceToRightEdge, 1);
	                this.swapCubbyItem(_cubby);
	              }
	            }
	          }
	        }
	      }
	      var ghostHeight = this.status === "rising" ? this.checkSpringHeight(ghostArrays) : undefined;
	      this.setGhostToReal(ghostArrays, ghostHeight);
	      if (this.status === "rising" || this.status === "descending") {
	        this.checkElevator();
	      }
	      if (this.status === "finished" && this.robot.pos[1] < -200) {
	        this.advanceLevel();
	      }
	    }
	  }, {
	    key: 'checkSpringHeight',
	    value: function checkSpringHeight(ghostArrays) {
	      var topRow = this.getTopRow(ghostArrays);
	      var leftCol = this.getLeftColumn(ghostArrays);
	      var rightCol = this.getRightColumn(ghostArrays);
	      if (this.passThrough(this.currentLevel.foregroundGrid[topRow][leftCol]) === false || this.passThrough(this.currentLevel.foregroundGrid[topRow][rightCol]) === false) {
	        var realTopY = this.getRealTopY(ghostArrays);
	        var diff = this.getBlockRealBottomY(topRow) - this.getRealTopY(ghostArrays);
	        return this.robot.height - diff;
	      }
	    }
	  }, {
	    key: 'cubbyAt',
	    value: function cubbyAt(rowCol) {
	      for (var i = 0; i < this.currentLevel.cubbies.length; i++) {
	        if (this.currentLevel.cubbies[i].rowCol[0] === rowCol[0] && this.currentLevel.cubbies[i].rowCol[1] === rowCol[1]) {
	          return this.currentLevel.cubbies[i];
	        }
	      }
	    }
	  }, {
	    key: 'heightCloseEnough',
	    value: function heightCloseEnough() {
	      return this.robot.height % BLOCK_LENGTH <= 20;
	    }
	  }, {
	    key: 'swapCubbyItem',
	    value: function swapCubbyItem(cubby) {
	      var itemFromCubby = cubby.item;
	      cubby.item = this.robot.item;
	      this.robot.item = itemFromCubby;
	      if (this.robot.item) {
	        this.robot.item.hasPower = false;
	      }
	      this.updatePower();
	    }
	  }, {
	    key: 'checkForSpring',
	    value: function checkForSpring(topRow, bottomRow, leftCol, rightCol) {
	      if (this.currentLevel.foregroundGrid[topRow][leftCol].toString() === "spring" && this.currentLevel.foregroundGrid[topRow][leftCol].pickedUp === false) {
	        this.getSpring(this.currentLevel.foregroundGrid[topRow][leftCol]);
	      }
	      if (this.currentLevel.foregroundGrid[topRow][rightCol].toString() === "spring" && this.currentLevel.foregroundGrid[topRow][rightCol].pickedUp === false) {
	        this.getSpring(this.currentLevel.foregroundGrid[topRow][rightCol]);
	      }
	      if (this.currentLevel.foregroundGrid[bottomRow][leftCol].toString() === "spring" && this.currentLevel.foregroundGrid[bottomRow][leftCol].pickedUp === false) {
	        this.getSpring(this.currentLevel.foregroundGrid[bottomRow][leftCol]);
	      }
	      if (this.currentLevel.foregroundGrid[bottomRow][rightCol].toString() === "spring" && this.currentLevel.foregroundGrid[bottomRow][rightCol].pickedUp === false) {
	        this.getSpring(this.currentLevel.foregroundGrid[bottomRow][rightCol]);
	      }
	    }
	  }, {
	    key: 'getSpring',
	    value: function getSpring(spring) {
	      spring.pickedUp = true;
	      this.robot.maxHeight += 75;
	    }
	  }, {
	    key: 'updatePower',
	    value: function updatePower() {
	      this.clearPower();
	      for (var i = 0; i < this.currentLevel.powerSources.length; i++) {
	        this.currentLevel.powerSources[i].sendPower(this.currentLevel.wiring, this.currentLevel.cubbies, this.currentLevel.buttonBlocks, this.currentLevel.forceFieldBlocks);
	      }
	    }
	  }, {
	    key: 'clearPower',
	    value: function clearPower() {
	      var _this3 = this;
	
	      var _loop = function _loop(i) {
	        if (_this3.currentLevel.wiring[i] instanceof _wire2.default) {
	          _this3.currentLevel.wiring[i].hasPower = false;
	        } else {
	          Object.keys(_this3.currentLevel.wiring[i].segments).forEach(function (key) {
	            this.currentLevel.wiring[i].segments[key].hasPower = false;
	          }.bind(_this3));
	        }
	      };
	
	      for (var i = 0; i < this.currentLevel.wiring.length; i++) {
	        _loop(i);
	      }
	      for (var _i = 0; _i < this.currentLevel.forceFieldBlocks.length; _i++) {
	        this.currentLevel.forceFieldBlocks[_i].hasPower = false;
	      }
	      for (var _i2 = 0; _i2 < this.currentLevel.buttonBlocks.length; _i2++) {
	        this.currentLevel.buttonBlocks[_i2].hasPower = false;
	      }
	    }
	  }, {
	    key: 'getLeftButtonEdge',
	    value: function getLeftButtonEdge(arrays) {
	      var nextColumnToRight = this.getRightColumn(arrays) + 1;
	      if (this.currentLevel.foregroundGrid[this.getTopRow(arrays)][nextColumnToRight].toString() === "ButtonBlock" && this.currentLevel.foregroundGrid[this.getTopRow(arrays)][nextColumnToRight].side === "left") {
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
	    }
	  }, {
	    key: 'getRightButtonEdge',
	    value: function getRightButtonEdge(arrays) {
	      var nextColumnToLeft = this.getLeftColumn(arrays) - 1;
	      if (this.currentLevel.foregroundGrid[this.getTopRow(arrays)][nextColumnToLeft].toString() === "ButtonBlock" && this.currentLevel.foregroundGrid[this.getTopRow(arrays)][nextColumnToLeft].side === "right") {
	        var button = this.currentLevel.foregroundGrid[this.getTopRow(arrays)][nextColumnToLeft];
	        var robotLeftX = this.getRealLeftX(arrays);
	        var blockRealLeftX = this.getBlockRealLeftX(this.getLeftColumn(arrays));
	        var buttonEdge = blockRealLeftX + this.renderer.BUTTON_PANEL_WIDTH;
	        if (robotLeftX < buttonEdge) {
	          return [buttonEdge, button];
	        } else {
	          return -1;
	        }
	      } else {
	        return -1;
	      }
	    }
	  }, {
	    key: 'getRightDoorEdge',
	    value: function getRightDoorEdge(arrays, door) {
	      if (door.status !== "open" && door.side === "left") {
	        var blockRealLeftX = this.getBlockRealLeftX(this.getLeftColumn(arrays));
	        var doorEdge = blockRealLeftX + this.BLOCK_LENGTH / 3;
	        return doorEdge;
	      } else {
	        return -1;
	      }
	    }
	  }, {
	    key: 'getLeftDoorEdge',
	    value: function getLeftDoorEdge(arrays, door) {
	      if (door.status !== "open" && door.side === "right") {
	        var blockRealRightX = this.getBlockRealRightX(this.getRightColumn(arrays));
	        var doorEdge = blockRealRightX - this.BLOCK_LENGTH / 3 - 1;
	        return doorEdge;
	      } else {
	        return -1;
	      }
	    }
	  }, {
	    key: 'passThrough',
	    value: function passThrough(object, aboveObject, dir) {
	      dir = dir || "";
	      if (object === "block" || object === "platform" || object.toString() === "door" && object.status === "closed" && object.side !== dir || object.toString() === "ButtonBlock" || object.toString() === "ForceFieldBlock" || object.toString() === "PowerSource" || object === "forceField" && aboveObject.hasPower) {
	        return false;
	      } else {
	        return true;
	      }
	    }
	  }, {
	    key: 'handleVerticalKeys',
	    value: function handleVerticalKeys(leftCol, rightCol, topRow, bottomRow, key) {
	      var elevators = this.currentLevel.elevators;
	      var belowRow = bottomRow + 1;
	      var foundElevator = false;
	      if (leftCol === rightCol) {
	        var elevatorsToLaunch = [];
	        for (var el = 0; el < elevators.length; el++) {
	          if (elevators[el].col === leftCol && elevators[el].baseRow - elevators[el].blocksHigh === bottomRow + 1) {
	            foundElevator = true;
	            elevatorsToLaunch.push(elevators[el]);
	            for (var j = 0; j < elevators.length; j++) {
	              if (j !== el && elevators[j].id === elevators[el].id) {
	                elevatorsToLaunch.push(elevators[j]);
	              }
	            }
	            var elevatorResult = this.launchElevatorMaybe(elevatorsToLaunch, key);
	            if (elevatorResult === false) {
	              this.adjustRobotHeight(leftCol, rightCol, topRow, bottomRow, key);
	            }
	            break;
	          }
	        }
	        if (foundElevator === false) {
	          this.adjustRobotHeight(leftCol, rightCol, topRow, bottomRow, key);
	        }
	      } else {
	        for (var _el = 0; _el < elevators.length; _el++) {
	          if (elevators[_el].col === leftCol && elevators[_el].baseRow - elevators[_el].blocksHigh === bottomRow + 1) {
	            foundElevator = true;
	            var foundSecondElevator = false;
	            for (var el2 = 0; el2 < elevators.length; el2++) {
	              if (elevators[el2] !== elevators[_el] && elevators[el2].id === elevators[_el].id && elevators[el2].col === rightCol) {
	                foundSecondElevator = true;
	                var _elevatorResult = this.launchElevatorMaybe([elevators[_el], elevators[el2]], key);
	                if (_elevatorResult) {
	                  return;
	                } else {
	                  //elevator didn't move (top or bottom floor)
	                  foundSecondElevator = false;
	                }
	              }
	            }
	            if (foundSecondElevator === false) {
	              this.adjustRobotHeight(leftCol, rightCol, topRow, bottomRow, key);
	            }
	          }
	        }
	        if (foundElevator === false) {
	          this.adjustRobotHeight(leftCol, rightCol, topRow, bottomRow, key);
	        }
	      }
	    }
	  }, {
	    key: 'adjustRobotHeight',
	    value: function adjustRobotHeight(leftCol, rightCol, topRow, bottomRow, key) {
	      var SPRING_SPEED = 6;
	      var adjustedHeightIncrement = SPRING_SPEED;
	      var leftUpperBlock = this.currentLevel.foregroundGrid[topRow - 1][leftCol];
	      var rightUpperBlock = this.currentLevel.foregroundGrid[topRow - 1][rightCol];
	      if (key === 'up') {
	        if (this.robot.height < this.robot.maxHeight) {
	          //reach end of spring?
	          var ghostHeight = this.robot.height + SPRING_SPEED;
	          if (ghostHeight > this.robot.maxHeight) {
	            adjustedHeightIncrement -= ghostHeight - this.robot.maxHeight;
	          }
	          //hit next row?
	          var distNextRow;
	          if (this.robot.height <= 10) {
	            distNextRow = 10 - this.robot.height;
	          } else {
	            distNextRow = 85 - this.robot.height;
	          }
	          var ghostDistNextRow = distNextRow - adjustedHeightIncrement;
	          if (ghostDistNextRow >= 0 || this.passThrough(leftUpperBlock) && this.passThrough(rightUpperBlock)) {
	            this.robot.height += adjustedHeightIncrement;
	          } else {
	            this.robot.height += distNextRow;
	          }
	        }
	      } else if (key === 'down') {
	        if (this.robot.height > 0) {
	          this.robot.height -= SPRING_SPEED;
	          if (this.robot.height < 0) {
	            this.robot.height = 0;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'launchElevatorMaybe',
	    value: function launchElevatorMaybe(elevatorArray, dir) {
	      this.elevatorArray = elevatorArray;
	      var blockHeightIndex = elevatorArray[0].heights.indexOf(elevatorArray[0].blocksHigh);
	      var destinationRow, stopAt;
	      if (dir === "up") {
	        if (elevatorArray[0].exit === true) {
	          this.status = "finished";
	        } else {
	          if (this.endOfElevator(elevatorArray, dir, blockHeightIndex) === false) {
	            this.newElevatorHeight = elevatorArray[0].heights[blockHeightIndex + 1];
	            destinationRow = elevatorArray[0].baseRow - elevatorArray[0].heights[blockHeightIndex + 1];
	            stopAt = 0 + BLOCK_LENGTH * destinationRow - 0.5;
	            this.status = "rising";
	            this.stopAt = stopAt;
	            return true;
	          } else {
	            return false;
	          }
	        }
	      } else if (dir === "down") {
	        if (this.endOfElevator(elevatorArray, dir, blockHeightIndex) === false) {
	          this.newElevatorHeight = elevatorArray[0].heights[blockHeightIndex - 1];
	          destinationRow = elevatorArray[0].baseRow - elevatorArray[0].heights[blockHeightIndex - 1];
	          stopAt = 0 + BLOCK_LENGTH * destinationRow - 0.5;
	          this.status = "descending";
	          this.stopAt = stopAt;
	          return true;
	        } else {
	          return false;
	        }
	      }
	    }
	  }, {
	    key: 'endOfElevator',
	    value: function endOfElevator(elevatorArray, dir, blockHeightIndex) {
	      if (dir === "up") {
	        return blockHeightIndex + 1 === elevatorArray[0].heights.length;
	      } else if (dir === "down") {
	        return blockHeightIndex === 0;
	      }
	    }
	  }, {
	    key: 'checkElevator',
	    value: function checkElevator() {
	      var _this4 = this;
	
	      if (this.status === "rising") {
	        var realRobotBottom = this.getRealBottomY([this.origin, this.robot.pos]);
	        if (realRobotBottom === this.stopAt) {
	          this._afterElevatorInNewSpot();
	        } else if (realRobotBottom < this.stopAt) {
	          (function () {
	            var difference = _this4.stopAt - realRobotBottom;
	            _this4.moveDown(difference, 1);
	            _this4.elevatorArray.forEach(function (elevator) {
	              elevator.additionalPixels -= difference;
	            });
	            _this4._afterElevatorInNewSpot();
	          })();
	        }
	      } else if (this.status === "descending") {
	        var _realRobotBottom = this.getRealBottomY([this.origin, this.robot.pos]);
	        if (_realRobotBottom === this.stopAt) {
	          this._afterElevatorInNewSpot();
	        } else if (_realRobotBottom > this.stopAt) {
	          (function () {
	            var difference = _realRobotBottom - _this4.stopAt;
	            _this4.moveUp(difference, 1);
	            _this4.elevatorArray.forEach(function (elevator) {
	              elevator.additionalPixels += difference;
	            });
	            _this4._afterElevatorInNewSpot();
	          })();
	        }
	      }
	    }
	  }, {
	    key: '_afterElevatorInNewSpot',
	    value: function _afterElevatorInNewSpot() {
	      this.status = "inControl";
	      var newElevatorHeight = this.newElevatorHeight;
	      this.elevatorArray.forEach(function (elevator) {
	        elevator.blocksHigh = newElevatorHeight;
	        elevator.topRow = elevator.baseRow - elevator.blocksHigh;
	        elevator.additionalPixels = 0;
	      });
	    }
	  }, {
	    key: 'moveLeft',
	    value: function moveLeft(pixels, modifier) {
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
	    }
	  }, {
	    key: 'moveRight',
	    value: function moveRight(pixels, modifier) {
	      var returnOrigin = this.origin;
	      var returnPos = this.robot.pos;
	      if (this.levelWidth - this.origin[0] < this.BLOCK_LENGTH * 8) {
	        returnOrigin[0] = this.levelWidth - this.BLOCK_LENGTH * 8;
	      } else if (this.robot.pos[0] === 263.5 && this.levelWidth - this.origin[0] > this.BLOCK_LENGTH * 8) {
	        returnOrigin[0] += pixels * modifier;
	      } else if (this.robot.pos[0] > 263.5 && this.levelWidth - this.origin[0] > this.BLOCK_LENGTH * 8) {
	        returnPos[0] = 263.5;
	        returnOrigin[0] += pixels * modifier;
	      } else {
	        returnPos[0] += pixels * modifier;
	      }
	      return [returnOrigin, returnPos];
	    }
	  }, {
	    key: 'moveUp',
	    value: function moveUp(pixels, modifier) {
	      var returnOrigin = this.origin;
	      var returnPos = this.robot.pos;
	      if (this.robot.pos[1] === 187.5 && this.origin[1] > 0) {
	        returnOrigin[1] -= pixels * modifier;
	      } else if (this.robot.pos[1] < 187.5 && this.origin[1] > 0) {
	        var difference = 187.5 - this.robot.pos[1];
	        returnOrigin[1] -= pixels * modifier;
	        returnPos[1] = 187.5;
	        returnOrigin[1] -= difference;
	      } else {
	        returnPos[1] -= pixels * modifier;
	      }
	      if (returnOrigin[1] < 0) {
	        //has the view passed the top of the level?
	        var _difference6 = 0 - returnOrigin[1]; //by how much?
	        returnOrigin[1] = 0; //set the view back to 0
	        returnPos[1] -= _difference6; //push the robot down by the same amount
	      }
	      return [returnOrigin, returnPos];
	    }
	  }, {
	    key: 'moveDown',
	    value: function moveDown(pixels, modifier) {
	      var returnOrigin = this.origin;
	      var returnPos = this.robot.pos;
	      var difference;
	      if (this.robot.pos[1] === 187.5 && this.levelHeight - this.origin[1] > this.BLOCK_LENGTH * 6) {
	        returnOrigin[1] += pixels * modifier;
	      } else if (this.robot.pos[1] > 187.5 && this.levelHeight - this.origin[1] > this.BLOCK_LENGTH * 6) {
	        difference = this.robot.pos[1] - 187.5;
	        returnOrigin[1] += pixels * modifier;
	        returnPos[1] = 187.5;
	        returnOrigin[1] += difference;
	      } else {
	        returnPos[1] += pixels * modifier;
	      }
	      var topOfScreenToLevelBottom = this.levelHeight - returnOrigin[1];
	      if (topOfScreenToLevelBottom < this.BLOCK_LENGTH * 6) {
	        difference = this.BLOCK_LENGTH * 6 - topOfScreenToLevelBottom;
	        returnOrigin[1] = this.levelHeight - this.BLOCK_LENGTH * 6;
	        returnPos[1] += difference;
	      }
	      return [returnOrigin, returnPos];
	    }
	  }, {
	    key: 'setGhostToReal',
	    value: function setGhostToReal(ghostArrays, ghostHeight) {
	      this.origin = ghostArrays[0];
	      this.robot.pos = ghostArrays[1];
	      if (ghostHeight) {
	        this.robot.height = ghostHeight;
	      }
	    }
	  }, {
	    key: 'getLeftColumn',
	    value: function getLeftColumn(arrays) {
	      var xInLevel = this.getRealLeftX(arrays);
	      var column = Math.floor(xInLevel / this.BLOCK_LENGTH);
	      return column;
	    }
	  }, {
	    key: 'getRightColumn',
	    value: function getRightColumn(arrays) {
	      var xInLevel = this.getRealRightX(arrays);
	      var column = Math.floor(xInLevel / this.BLOCK_LENGTH);
	      return column;
	    }
	  }, {
	    key: 'getTopRow',
	    value: function getTopRow(arrays) {
	      var yInLevel = this.getRealTopY(arrays);
	      var row = Math.floor(yInLevel / this.BLOCK_LENGTH);
	      return row;
	    }
	  }, {
	    key: 'getBottomRow',
	    value: function getBottomRow(arrays) {
	      var yInLevel = this.getRealBottomY(arrays);
	      var row = Math.floor(yInLevel / this.BLOCK_LENGTH);
	      return row;
	    }
	  }, {
	    key: 'getRealLeftX',
	    value: function getRealLeftX(arrays) {
	      return arrays[0][0] + arrays[1][0];
	    }
	  }, {
	    key: 'getRealRightX',
	    value: function getRealRightX(arrays) {
	      return arrays[0][0] + (arrays[1][0] + this.BLOCK_LENGTH - 1);
	    }
	  }, {
	    key: 'getRealTopY',
	    value: function getRealTopY(arrays) {
	      return arrays[0][1] + arrays[1][1] - this.robot.height + 10;
	    }
	  }, {
	    key: 'getRealBottomY',
	    value: function getRealBottomY(arrays) {
	      return arrays[0][1] + (arrays[1][1] + this.BLOCK_LENGTH - 1);
	    }
	  }, {
	    key: 'getBlockRealRightX',
	    value: function getBlockRealRightX(column) {
	      return 0.5 + (column + 1) * this.BLOCK_LENGTH;
	    }
	  }, {
	    key: 'getBlockRealLeftX',
	    value: function getBlockRealLeftX(column) {
	      return 0.5 + column * this.BLOCK_LENGTH;
	    }
	  }, {
	    key: 'getBlockRealBottomY',
	    value: function getBlockRealBottomY(row) {
	      return 0.5 + (row + 1) * this.BLOCK_LENGTH;
	    }
	  }]);
	
	  return Game;
	}();
	
	module.exports = Game;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _level_builder = __webpack_require__(12);
	
	var _level_builder2 = _interopRequireDefault(_level_builder);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Level = _level_builder2.default.Level;
	var LevelBuilder = _level_builder2.default.LevelBuilder;
	var Door = _level_builder2.default.Door;
	var Elevator = _level_builder2.default.Elevator;
	var ExitElevator = _level_builder2.default.ExitElevator;
	var ButtonBlock = _level_builder2.default.ButtonBlock;
	var Cubby = _level_builder2.default.Cubby;
	var Wire = _level_builder2.default.Wire;
	var WireJunction = _level_builder2.default.WireJunction;
	var PowerSource = _level_builder2.default.PowerSource;
	var ForceFieldBlock = _level_builder2.default.ForceFieldBlock;
	var Panel = _level_builder2.default.Panel;
	var Spring = _level_builder2.default.Spring;
	var Message = _level_builder2.default.Message;
	
	var builder = new LevelBuilder();
	
	var doors = [new Door(101, "left"), new Door(102, "left")];
	
	var messages = [new Message(0, 7, 0, 5, "top", "Use the arrow keys to move left and right."), new Message(9, 18, 3, 5, "top", "You can also use the up and down", "arrow keys to ride elevators."), new Message(9, 18, 0, 2, "bottom", "You can also use the up and down", "arrow keys to ride elevators."), new Message(23, 30, 2, 5, "top", "Push buttons to open doors."), new Message(35, 39, 2, 5, "top", "Press spacebar while in front of a socket", "to insert or remove a panel."), new Message(41, 43, 2, 5, "top", "Place the correct panel in this socket", "to send power to the button."), new Message(48, 54, 2, 5, "top", "Disrupt power to force fields", "to pass through them."), new Message(58, 61, 2, 5, "top", "The spring power-up allows you to extend", "the height of your robot."), new Message(61, 69, 2, 5, "top", "Now you can use the up and down", "arrow keys to adjust your height."), new Message(70, 76, 3, 4, "top", "Your goal is to find the red elevators.", "You can ride them up to the next level.")];
	
	var elevators = [new Elevator({
	  id: 101,
	  baseRowCol: [5, 11],
	  startingHeight: 0,
	  heights: [0, 3]
	}), new Elevator({
	  id: 101,
	  baseRowCol: [5, 12],
	  startingHeight: 0,
	  heights: [0, 3]
	}), new Elevator({
	  id: 102,
	  baseRowCol: [5, 17],
	  startingHeight: 3,
	  heights: [0, 3]
	}), new Elevator({
	  id: 102,
	  baseRowCol: [5, 18],
	  startingHeight: 3,
	  heights: [0, 3]
	}), new Elevator({
	  id: 103,
	  baseRowCol: [5, 24],
	  startingHeight: 0,
	  heights: [0, 2]
	}), new Elevator({
	  id: 103,
	  baseRowCol: [5, 25],
	  startingHeight: 0,
	  heights: [0, 2]
	}), new Elevator({
	  id: 104,
	  baseRowCol: [5, 45],
	  startingHeight: 0,
	  heights: [0, 2]
	}), new Elevator({
	  id: 104,
	  baseRowCol: [5, 46],
	  startingHeight: 0,
	  heights: [0, 2]
	}), new ExitElevator({
	  id: 105,
	  baseRowCol: [5, 75],
	  startingHeight: 0,
	  heights: [0, 10]
	}), new ExitElevator({
	  id: 105,
	  baseRowCol: [5, 76],
	  startingHeight: 0,
	  heights: [0, 10]
	})];
	
	var cubbies = [new Cubby({
	  id: "C101",
	  rowCol: [4, 36],
	  startItem: new Panel(["E", "W"])
	}), new Cubby({
	  id: "C101",
	  rowCol: [4, 37],
	  startItem: new Panel(["N", "S"])
	}), new Cubby({
	  id: "C101",
	  rowCol: [4, 38],
	  startItem: new Panel(["S", "W"])
	}), new Cubby({
	  id: "C101",
	  rowCol: [4, 42],
	  startItem: null
	}), new Cubby({
	  id: "C101",
	  rowCol: [4, 52],
	  startItem: new Panel(["N", "S"])
	}), new Cubby({
	  id: "C101",
	  rowCol: [3, 68],
	  startItem: new Panel(["N", "E"])
	})];
	
	var powerSources = [new PowerSource({
	  id: "PS101",
	  rowCol: [0, 29]
	}), new PowerSource({
	  id: "PS102",
	  rowCol: [5, 42]
	}), new PowerSource({
	  id: "PS103",
	  rowCol: [5, 52]
	}), new PowerSource({
	  id: "PS104",
	  rowCol: [0, 68]
	})];
	
	var wiring = [new Wire({ rowCol: [2, 29], type: "NW" }), new Wire({ rowCol: [1, 29], type: "NS" }), new WireJunction({ rowCol: [4, 42], segmentStrings: ["N", "S"] }), new Wire({ rowCol: [3, 42], type: "NS" }), new Wire({ rowCol: [2, 42], type: "ES" }), new WireJunction({ rowCol: [4, 52], segmentStrings: ["N", "S"] }), new Wire({ rowCol: [3, 52], type: "ES" }), new Wire({ rowCol: [3, 53], type: "EW" }), new Wire({ rowCol: [1, 68], type: "NS" }), new Wire({ rowCol: [2, 68], type: "NS" }), new WireJunction({ rowCol: [3, 68], segmentStrings: ["N", "E"] })];
	
	var buttonBlocks = [new ButtonBlock({
	  id: "BB101",
	  side: "left",
	  rowCol: [2, 28],
	  func: function func() {
	    doors[0].open();
	  }
	}), new ButtonBlock({
	  id: "BB102",
	  side: "right",
	  rowCol: [2, 43],
	  func: function func() {
	    doors[1].open();
	  }
	})];
	
	var forceFieldBlocks = [new ForceFieldBlock({
	  id: "FF101",
	  rowCol: [2, 53]
	}), new ForceFieldBlock({
	  id: "FF101",
	  rowCol: [3, 69]
	})];
	
	var foregroundGrid = [builder.rowOf(29, "block").concat([powerSources[0]]).concat(builder.rowOf(38, "block")).concat([powerSources[3]]).concat(builder.rowOf(6, "block")).concat(["", "", "block"]), ["block"].concat(builder.rowOf(9, "")).concat(["block"]).concat(builder.rowOf(8, "")).concat(["block"]).concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(6, "")).concat(["block"]).concat(builder.rowOf(10, "")).concat(["block"]).concat(builder.rowOf(5, "")).concat(["block"]).concat(builder.rowOf(29, "")).concat(["block"]), ["block"].concat(builder.rowOf(12, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(6, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat([buttonBlocks[0]]).concat(["", "block"]).concat(builder.rowOf(10, "")).concat(["block"]).concat(["", buttonBlocks[1]]).concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(29, "")).concat(["block"]), ["block"].concat(builder.rowOf(12, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(9, "")).concat(builder.rowOf(5, "block")).concat(builder.rowOf(10, "")).concat(["block", ""]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(6, "")).concat([forceFieldBlocks[0]]).concat(builder.rowOf(14, "")).concat([forceFieldBlocks[1]]).concat(builder.rowOf(7, "")).concat(["block"]), ["block"].concat(builder.rowOf(12, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(13, "")).concat(doors[0]).concat(builder.rowOf(16, "")).concat(doors[1]).concat(builder.rowOf(6, "")).concat(["forceField"]).concat(builder.rowOf(7, "")).concat([new Spring()]).concat(builder.rowOf(6, "")).concat(["forceField"]).concat(builder.rowOf(7, "")).concat(["block"]), builder.rowOf(11, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(16, "block")).concat([powerSources[1]]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")).concat([powerSources[2]]).concat(builder.rowOf(22, "block")).concat(["", "", "block"])];
	
	var backgroundGrid = [builder.rowOf(78, "brick"), builder.rowOf(78, "brick"), builder.rowOf(78, "brick"), builder.rowOf(78, "brick"), builder.rowOf(78, "brick"), builder.rowOf(78, "brick")];
	
	var level = new Level({
	  color: '#632612',
	  foregroundGrid: foregroundGrid,
	  backgroundGrid: backgroundGrid,
	  startingPos: [225.5, 300.5],
	  elevators: elevators,
	  doors: doors,
	  cubbies: cubbies,
	  wiring: wiring,
	  powerSources: powerSources,
	  forceFieldBlocks: forceFieldBlocks,
	  buttonBlocks: buttonBlocks,
	  messages: messages
	});
	
	module.exports = level;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _door = __webpack_require__(6);
	
	var _door2 = _interopRequireDefault(_door);
	
	var _elevator = __webpack_require__(13);
	
	var _elevator2 = _interopRequireDefault(_elevator);
	
	var _exitElevator = __webpack_require__(14);
	
	var _exitElevator2 = _interopRequireDefault(_exitElevator);
	
	var _buttonBlock = __webpack_require__(7);
	
	var _buttonBlock2 = _interopRequireDefault(_buttonBlock);
	
	var _cubby = __webpack_require__(8);
	
	var _cubby2 = _interopRequireDefault(_cubby);
	
	var _wire = __webpack_require__(2);
	
	var _wire2 = _interopRequireDefault(_wire);
	
	var _wireJunction = __webpack_require__(3);
	
	var _wireJunction2 = _interopRequireDefault(_wireJunction);
	
	var _powerSource = __webpack_require__(15);
	
	var _powerSource2 = _interopRequireDefault(_powerSource);
	
	var _forceFieldBlock = __webpack_require__(16);
	
	var _forceFieldBlock2 = _interopRequireDefault(_forceFieldBlock);
	
	var _panel = __webpack_require__(9);
	
	var _panel2 = _interopRequireDefault(_panel);
	
	var _spring = __webpack_require__(17);
	
	var _spring2 = _interopRequireDefault(_spring);
	
	var _message = __webpack_require__(18);
	
	var _message2 = _interopRequireDefault(_message);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Level = function Level(options) {
	  _classCallCheck(this, Level);
	
	  this.name = options.name;
	  this.color = options.color;
	  this.foregroundGrid = options.foregroundGrid;
	  this.backgroundGrid = options.backgroundGrid;
	  this.startingPos = options.startingPos;
	  this.elevators = options.elevators;
	  this.doors = options.doors;
	  this.cubbies = options.cubbies;
	  this.wiring = options.wiring;
	  this.powerSources = options.powerSources;
	  this.forceFieldBlocks = options.forceFieldBlocks;
	  this.buttonBlocks = options.buttonBlocks;
	  this.messages = options.messages;
	};
	
	var LevelBuilder = function () {
	  function LevelBuilder() {
	    _classCallCheck(this, LevelBuilder);
	  }
	
	  _createClass(LevelBuilder, [{
	    key: 'rowOf',
	    value: function rowOf(rowLength, something) {
	      var rowArray = [];
	      for (var i = 0; i < rowLength; i++) {
	        rowArray.push(something);
	      }
	      return rowArray;
	    }
	  }]);
	
	  return LevelBuilder;
	}();
	
	module.exports = {
	  Level: Level,
	  LevelBuilder: LevelBuilder,
	  Door: _door2.default,
	  Elevator: _elevator2.default,
	  ExitElevator: _exitElevator2.default,
	  ButtonBlock: _buttonBlock2.default,
	  Cubby: _cubby2.default,
	  Wire: _wire2.default,
	  WireJunction: _wireJunction2.default,
	  PowerSource: _powerSource2.default,
	  ForceFieldBlock: _forceFieldBlock2.default,
	  Panel: _panel2.default,
	  Spring: _spring2.default,
	  Message: _message2.default
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Elevator = function () {
	  function Elevator(options) {
	    _classCallCheck(this, Elevator);
	
	    this.id = options.id;
	    this.col = options.baseRowCol[1];
	    this.baseRow = options.baseRowCol[0];
	    this.blocksHigh = options.startingHeight || 0;
	    this.speed = options.speed || 400;
	    this.heights = options.heights;
	
	    this.topRow = this.baseRow - this.blocksHigh;
	    this.additionalPixels = 0;
	  }
	
	  _createClass(Elevator, [{
	    key: "toString",
	    value: function toString() {
	      return "elevator";
	    }
	  }]);
	
	  return Elevator;
	}();
	
	module.exports = Elevator;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _elevator = __webpack_require__(13);
	
	var _elevator2 = _interopRequireDefault(_elevator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var ExitElevator = function (_Elevator) {
	  _inherits(ExitElevator, _Elevator);
	
	  function ExitElevator(options) {
	    _classCallCheck(this, ExitElevator);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExitElevator).call(this, options));
	
	    _this.exit = true;
	    return _this;
	  }
	
	  return ExitElevator;
	}(_elevator2.default);
	
	module.exports = ExitElevator;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _powerObject = __webpack_require__(22);
	
	var _powerObject2 = _interopRequireDefault(_powerObject);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var PowerSource = function (_PowerObject) {
	  _inherits(PowerSource, _PowerObject);
	
	  function PowerSource(options) {
	    _classCallCheck(this, PowerSource);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(PowerSource).call(this, options));
	  }
	
	  return PowerSource;
	}(_powerObject2.default);
	
	module.exports = PowerSource;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _powerObject = __webpack_require__(22);
	
	var _powerObject2 = _interopRequireDefault(_powerObject);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var ForceFieldBlock = function (_PowerObject) {
	  _inherits(ForceFieldBlock, _PowerObject);
	
	  function ForceFieldBlock(options) {
	    _classCallCheck(this, ForceFieldBlock);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ForceFieldBlock).call(this, options));
	  }
	
	  return ForceFieldBlock;
	}(_powerObject2.default);
	
	module.exports = ForceFieldBlock;

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Spring = function () {
	  function Spring(options) {
	    _classCallCheck(this, Spring);
	
	    this.pickedUp = false;
	  }
	
	  _createClass(Spring, [{
	    key: "toString",
	    value: function toString() {
	      return "spring";
	    }
	  }]);
	
	  return Spring;
	}();
	
	module.exports = Spring;

/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Message = function Message(left, right, top, bottom, pos, text, text2) {
	  _classCallCheck(this, Message);
	
	  this.left = left;
	  this.right = right;
	  this.top = top;
	  this.bottom = bottom;
	  this.pos = pos;
	  this.text = text;
	  this.text2 = text2;
	};
	
	module.exports = Message;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _level_builder = __webpack_require__(12);
	
	var _level_builder2 = _interopRequireDefault(_level_builder);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Level = _level_builder2.default.Level;
	var LevelBuilder = _level_builder2.default.LevelBuilder;
	var Door = _level_builder2.default.Door;
	var Elevator = _level_builder2.default.Elevator;
	var ExitElevator = _level_builder2.default.ExitElevator;
	var ButtonBlock = _level_builder2.default.ButtonBlock;
	var Cubby = _level_builder2.default.Cubby;
	var Wire = _level_builder2.default.Wire;
	var WireJunction = _level_builder2.default.WireJunction;
	var PowerSource = _level_builder2.default.PowerSource;
	var ForceFieldBlock = _level_builder2.default.ForceFieldBlock;
	var Panel = _level_builder2.default.Panel;
	var Spring = _level_builder2.default.Spring;
	
	var builder = new LevelBuilder();
	
	var doors = [new Door(101, "right"), new Door(102, "left")];
	
	var elevators = [new Elevator({
	  id: 101,
	  baseRowCol: [10, 5],
	  startingHeight: 4,
	  heights: [0, 4, 8]
	}), new Elevator({
	  id: 101,
	  baseRowCol: [10, 6],
	  startingHeight: 4,
	  heights: [0, 4, 8]
	}), new Elevator({
	  id: 102,
	  baseRowCol: [10, 1],
	  startingHeight: 0,
	  heights: [0, 6]
	}), new Elevator({
	  id: 103,
	  baseRowCol: [12, 17],
	  startingHeight: 6,
	  heights: [0, 3, 6, 10]
	}), new Elevator({
	  id: 103,
	  baseRowCol: [12, 18],
	  startingHeight: 6,
	  heights: [0, 3, 6, 10]
	}), new ExitElevator({
	  id: 104,
	  baseRowCol: [2, 21],
	  startingHeight: 0,
	  heights: [0, 3, 6, 10]
	}), new ExitElevator({
	  id: 104,
	  baseRowCol: [2, 22],
	  startingHeight: 0,
	  heights: [0]
	})];
	
	var cubbies = [new Cubby({
	  id: "C101",
	  rowCol: [1, 2],
	  startItem: new Panel(["N", "S"])
	}), new Cubby({
	  id: "C102",
	  rowCol: [11, 15],
	  startItem: new Panel(["E", "W"])
	}), new Cubby({
	  id: "C103",
	  rowCol: [4, 13],
	  startItem: null
	}), new Cubby({
	  id: "C104",
	  rowCol: [8, 21],
	  startItem: new Panel(["S", "W"])
	})];
	
	var powerSources = [new PowerSource({
	  id: "PS101",
	  rowCol: [11, 22]
	})];
	
	var wiring = [
	//Force Field Block
	new Wire({ rowCol: [11, 21], type: "EW" }), new Wire({ rowCol: [11, 20], type: "EW" }), new Wire({ rowCol: [11, 19], type: "EW" }), new Wire({ rowCol: [11, 18], type: "EW" }), new Wire({ rowCol: [11, 17], type: "EW" }), new Wire({ rowCol: [11, 16], type: "EW" }), new WireJunction({ rowCol: [11, 15], segmentStrings: ["E", "W"] }), new Wire({ rowCol: [11, 14], type: "NE" }), new Wire({ rowCol: [10, 14], type: "NS" }), new Wire({ rowCol: [9, 14], type: "NS" }), new Wire({ rowCol: [8, 14], type: "NS" }), new Wire({ rowCol: [7, 14], type: "NS" }), new Wire({ rowCol: [6, 14], type: "NS" }), new Wire({ rowCol: [5, 14], type: "NSW" }), new Wire({ rowCol: [4, 14], type: "ES" }), new Wire({ rowCol: [4, 15], type: "EW" }), new Wire({ rowCol: [4, 16], type: "EW" }), new Wire({ rowCol: [4, 17], type: "EW" }), new Wire({ rowCol: [4, 18], type: "EW" }),
	
	//Branch to top button
	new Wire({ rowCol: [1, 13], type: "ES" }), new Wire({ rowCol: [2, 13], type: "NS" }), new Wire({ rowCol: [3, 13], type: "NS" }), new WireJunction({ rowCol: [4, 13], segmentStrings: ["N", "S", "W"] }), new Wire({ rowCol: [5, 13], type: "NE" }),
	
	//Branch to left button
	new Wire({ rowCol: [3, 5], type: "EW" }), new Wire({ rowCol: [3, 6], type: "EW" }), new Wire({ rowCol: [3, 7], type: "WS" }), new Wire({ rowCol: [4, 7], type: "NE" }), new Wire({ rowCol: [4, 8], type: "EW" }), new Wire({ rowCol: [4, 9], type: "EW" }), new Wire({ rowCol: [4, 10], type: "EW" }), new Wire({ rowCol: [4, 11], type: "EW" }), new Wire({ rowCol: [4, 12], type: "EW" })];
	
	var buttonBlocks = [new ButtonBlock({
	  id: "BB101",
	  side: "left",
	  rowCol: [3, 4],
	  func: function func() {
	    doors[0].open();
	  }
	}), new ButtonBlock({
	  id: "BB102",
	  side: "right",
	  rowCol: [1, 14],
	  func: function func() {
	    doors[1].open();
	  }
	})];
	
	var forceFieldBlocks = [new ForceFieldBlock({
	  id: "FF101",
	  rowCol: [4, 19]
	})];
	
	var foregroundGrid = [builder.rowOf(21, "block").concat(builder.rowOf(2, "")).concat(["block"]), ["block"].concat(builder.rowOf(2, "")).concat(doors[0]).concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(6, "")).concat([buttonBlocks[1]]).concat(builder.rowOf(4, "")).concat(doors[1]).concat(builder.rowOf(3, "")).concat(["block"]), builder.rowOf(5, "block").concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(6, "")).concat(builder.rowOf(3, "platform")).concat(builder.rowOf(2, "")).concat(builder.rowOf(2, "block")).concat(builder.rowOf(2, "")).concat(["block"]), ["block"].concat(builder.rowOf(3, "")).concat([buttonBlocks[0]]).concat(builder.rowOf(12, "")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")), ["block"].concat([""]).concat(builder.rowOf(3, "block")).concat(builder.rowOf(14, "")).concat([forceFieldBlocks[0]]).concat(builder.rowOf(3, "")).concat(["block"]), ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(14, "")).concat(builder.rowOf(1, "forceField")).concat(builder.rowOf(1, "")).concat(new Spring()).concat([""]).concat(["block"]), ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(7, "block")).concat(["platform"]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")), ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(5, "block")).concat([""]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(6, "")).concat(["block"]), ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(5, "block")).concat([""]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(6, "")).concat(["block"]), ["block"].concat(builder.rowOf(4, "")).concat(builder.rowOf(4, "")).concat(builder.rowOf(5, "block")).concat([""]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")), ["block", ""].concat(builder.rowOf(3, "block")).concat(builder.rowOf(2, elevators[0])).concat(builder.rowOf(7, "block")).concat([""]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(5, "")).concat(builder.rowOf(2, "powerBlock")), builder.rowOf(14, "block").concat(builder.rowOf(8, "")).concat([powerSources[0]]).concat(["powerBlock"]), builder.rowOf(17, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block"))];
	
	var backgroundGrid = [builder.rowOf(24, "brick"), builder.rowOf(24, "brick"), builder.rowOf(24, "brick"), builder.rowOf(24, "brick"), builder.rowOf(24, "brick"), builder.rowOf(24, "brick"), builder.rowOf(24, "brick"), builder.rowOf(24, "brick"), builder.rowOf(24, "brick"), builder.rowOf(24, "brick"), builder.rowOf(24, "brick"), builder.rowOf(24, "brick"), builder.rowOf(24, "brick")];
	
	var level = new Level({
	  name: "Level 1",
	  color: '#632612',
	  foregroundGrid: foregroundGrid,
	  backgroundGrid: backgroundGrid,
	  startingPos: [750.5, 375.5],
	  elevators: elevators,
	  doors: doors,
	  cubbies: cubbies,
	  wiring: wiring,
	  powerSources: powerSources,
	  forceFieldBlocks: forceFieldBlocks,
	  buttonBlocks: buttonBlocks
	});
	
	module.exports = level;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _level_builder = __webpack_require__(12);
	
	var _level_builder2 = _interopRequireDefault(_level_builder);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Level = _level_builder2.default.Level;
	var LevelBuilder = _level_builder2.default.LevelBuilder;
	var Door = _level_builder2.default.Door;
	var Elevator = _level_builder2.default.Elevator;
	var ExitElevator = _level_builder2.default.ExitElevator;
	var ButtonBlock = _level_builder2.default.ButtonBlock;
	var Cubby = _level_builder2.default.Cubby;
	var Wire = _level_builder2.default.Wire;
	var WireJunction = _level_builder2.default.WireJunction;
	var PowerSource = _level_builder2.default.PowerSource;
	var ForceFieldBlock = _level_builder2.default.ForceFieldBlock;
	var Panel = _level_builder2.default.Panel;
	var Spring = _level_builder2.default.Spring;
	
	var builder = new LevelBuilder();
	
	var doors = [];
	
	var elevators = [new Elevator({
	  id: 101,
	  baseRowCol: [13, 13],
	  startingHeight: 0,
	  heights: [0, 4, 8]
	}), new Elevator({
	  id: 101,
	  baseRowCol: [13, 14],
	  startingHeight: 0,
	  heights: [0, 4, 8]
	}), new Elevator({
	  id: 102,
	  baseRowCol: [13, 7],
	  startingHeight: 0,
	  heights: [0, 2]
	}), new Elevator({
	  id: 103,
	  baseRowCol: [17, 1],
	  startingHeight: 12,
	  heights: [0, 6, 12]
	}), new ExitElevator({
	  id: 104,
	  baseRowCol: [9, 17],
	  startingHeight: 0,
	  heights: [0]
	}), new ExitElevator({
	  id: 104,
	  baseRowCol: [9, 18],
	  startingHeight: 0,
	  heights: [0]
	})];
	
	var cubbies = [new Cubby({
	  id: "C101",
	  rowCol: [3, 12],
	  startItem: new Panel(["E", "W"])
	}), new Cubby({
	  id: "C102",
	  rowCol: [7, 12],
	  startItem: new Panel(["E", "W"])
	}), new Cubby({
	  id: "C103",
	  rowCol: [16, 3],
	  startItem: null
	})];
	
	var powerSources = [new PowerSource({
	  id: "PS101",
	  rowCol: [11, 22]
	}), new PowerSource({
	  id: "PS102",
	  rowCol: [7, 9]
	}), new PowerSource({
	  id: "PS103",
	  rowCol: [8, 8]
	})];
	
	var wiring = [new Wire({ rowCol: [7, 10], type: "EW" }), new Wire({ rowCol: [7, 11], type: "EW" }), new WireJunction({ rowCol: [7, 12], segmentStrings: ["E", "W"] }), new Wire({ rowCol: [7, 13], type: "EW" }), new Wire({ rowCol: [7, 14], type: "EW" }), new Wire({ rowCol: [6, 9], type: "NS" }), new Wire({ rowCol: [5, 9], type: "NS" }), new Wire({ rowCol: [4, 9], type: "NS" }), new Wire({ rowCol: [3, 9], type: "ES" }), new Wire({ rowCol: [3, 10], type: "EW" }), new Wire({ rowCol: [3, 11], type: "EW" }), new WireJunction({ rowCol: [3, 12], segmentStrings: ["E", "W"] }), new Wire({ rowCol: [3, 13], type: "EW" }), new Wire({ rowCol: [3, 14], type: "EW" }), new Wire({ rowCol: [3, 15], type: "EW" }), new Wire({ rowCol: [3, 16], type: "WS" }), new Wire({ rowCol: [4, 16], type: "NS" }), new Wire({ rowCol: [5, 16], type: "NS" }), new Wire({ rowCol: [6, 16], type: "NS" }), new Wire({ rowCol: [8, 7], type: "EW" }), new Wire({ rowCol: [8, 6], type: "EW" }), new Wire({ rowCol: [8, 5], type: "EW" }), new Wire({ rowCol: [8, 4], type: "ES" })];
	
	var buttonBlocks = [];
	
	var forceFieldBlocks = [new ForceFieldBlock({
	  id: "FF101",
	  rowCol: [7, 15]
	}), new ForceFieldBlock({
	  id: "FF102",
	  rowCol: [7, 16]
	}), new ForceFieldBlock({
	  id: "FF103",
	  rowCol: [9, 4]
	})];
	
	var foregroundGrid = [builder.rowOf(17, "block").concat(builder.rowOf(2, "")).concat(["block"]), ["block"].concat(builder.rowOf(18, "")).concat(["block"]), ["block"].concat(builder.rowOf(18, "")).concat(["block"]), ["block"].concat(builder.rowOf(18, "")).concat(["block"]), ["block"].concat(builder.rowOf(14, "")).concat(["block"]).concat(builder.rowOf(3, "")).concat(["block"]), ["block"].concat([""]).concat(builder.rowOf(11, "platform")).concat(builder.rowOf(2, "")).concat(["platform"]).concat(builder.rowOf(3, "")).concat(["block"]), ["block"].concat(builder.rowOf(18, "")).concat(["block"]), ["block"].concat(builder.rowOf(7, "")).concat(["powerBlock"]).concat([powerSources[0]]).concat(builder.rowOf(5, "")).concat([forceFieldBlocks[0]]).concat([forceFieldBlocks[1]]).concat(builder.rowOf(2, "")).concat(["block"]), ["block"].concat(builder.rowOf(7, "")).concat([powerSources[2]]).concat([powerSources[1]]).concat(builder.rowOf(5, "")).concat(builder.rowOf(2, "forceField")).concat(builder.rowOf(2, "")).concat(["block"]), ["block"].concat([""]).concat(builder.rowOf(2, "")).concat([forceFieldBlocks[2]]).concat(builder.rowOf(3, "block")).concat(["block"]).concat(builder.rowOf(4, "platform")).concat(builder.rowOf(2, "")).concat(builder.rowOf(2, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(1, "block")), ["block"].concat(builder.rowOf(2, "")).concat(new Spring()).concat(["forceField"]).concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(7, "")).concat(builder.rowOf(4, "block")), ["block"].concat([""]).concat(builder.rowOf(5, "block")).concat(builder.rowOf(12, "")).concat(["block"]), ["block"].concat([""]).concat(builder.rowOf(5, "block")).concat(builder.rowOf(12, "")).concat(["block"]), ["block"].concat([""]).concat(builder.rowOf(5, "block")).concat([""]).concat(builder.rowOf(5, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")), ["block"].concat([""]).concat(builder.rowOf(18, "block")), ["block"].concat([""]).concat(builder.rowOf(18, "block")), ["block"].concat(builder.rowOf(4, "")).concat(builder.rowOf(15, "block")), ["block"].concat([""]).concat(builder.rowOf(18, "block"))];
	
	var backgroundGrid = [builder.rowOf(20, "brick"), builder.rowOf(20, "brick"), builder.rowOf(20, "brick"), builder.rowOf(20, "brick"), builder.rowOf(20, "brick"), builder.rowOf(20, "brick"), builder.rowOf(20, "brick"), builder.rowOf(20, "brick"), builder.rowOf(20, "brick"), builder.rowOf(20, "brick"), builder.rowOf(20, "brick"), builder.rowOf(20, "brick"), builder.rowOf(20, "brick"), builder.rowOf(20, "brick"), builder.rowOf(20, "brick"), builder.rowOf(20, "brick"), builder.rowOf(20, "brick"), builder.rowOf(20, "brick")];
	
	var level = new Level({
	  name: "Level 2",
	  color: '#4A7A36',
	  foregroundGrid: foregroundGrid,
	  backgroundGrid: backgroundGrid,
	  startingPos: [675.5, 900.5],
	  elevators: elevators,
	  doors: doors,
	  cubbies: cubbies,
	  wiring: wiring,
	  powerSources: powerSources,
	  forceFieldBlocks: forceFieldBlocks,
	  buttonBlocks: buttonBlocks
	});
	
	module.exports = level;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _level_builder = __webpack_require__(12);
	
	var _level_builder2 = _interopRequireDefault(_level_builder);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Level = _level_builder2.default.Level;
	var LevelBuilder = _level_builder2.default.LevelBuilder;
	var Door = _level_builder2.default.Door;
	var Elevator = _level_builder2.default.Elevator;
	var ExitElevator = _level_builder2.default.ExitElevator;
	var ButtonBlock = _level_builder2.default.ButtonBlock;
	var Cubby = _level_builder2.default.Cubby;
	var Wire = _level_builder2.default.Wire;
	var WireJunction = _level_builder2.default.WireJunction;
	var PowerSource = _level_builder2.default.PowerSource;
	var ForceFieldBlock = _level_builder2.default.ForceFieldBlock;
	var Panel = _level_builder2.default.Panel;
	var Spring = _level_builder2.default.Spring;
	
	var builder = new LevelBuilder();
	
	var doors = [new Door(101, "right", 'green'), new Door(102, "right"), new Door(103, "right"), new Door(104, "right"), new Door(105, "right", 'green'), new Door(106, "left"), new Door(107, "left", 'green'), new Door(108, "right", 'green'), new Door(109, "left", 'green'), new Door(110, "left")];
	
	var elevators = [new Elevator({
	  id: 102,
	  baseRowCol: [9, 9],
	  startingHeight: 0,
	  heights: [0, 3]
	}), new Elevator({
	  id: 102,
	  baseRowCol: [9, 10],
	  startingHeight: 0,
	  heights: [0, 3]
	}), new Elevator({
	  id: 103,
	  baseRowCol: [6, 6],
	  startingHeight: 0,
	  heights: [0, 3]
	}), new Elevator({
	  id: 103,
	  baseRowCol: [6, 7],
	  startingHeight: 0,
	  heights: [0, 3]
	}), new Elevator({
	  id: 104,
	  baseRowCol: [15, 6],
	  startingHeight: 0,
	  heights: [0, 3, 6]
	}), new Elevator({
	  id: 104,
	  baseRowCol: [15, 7],
	  startingHeight: 0,
	  heights: [0, 3, 6]
	}), new Elevator({
	  id: 105,
	  baseRowCol: [9, 1],
	  startingHeight: 3,
	  heights: [0, 3]
	}), new Elevator({
	  id: 106,
	  baseRowCol: [18, 11],
	  startingHeight: 0,
	  heights: [0, 3]
	}), new Elevator({
	  id: 106,
	  baseRowCol: [18, 12],
	  startingHeight: 0,
	  heights: [0, 3]
	}), new Elevator({
	  id: 107,
	  baseRowCol: [18, 19],
	  startingHeight: 0,
	  heights: [0, 3]
	}), new Elevator({
	  id: 107,
	  baseRowCol: [18, 20],
	  startingHeight: 0,
	  heights: [0, 3]
	}), new Elevator({
	  id: 108,
	  baseRowCol: [15, 24],
	  startingHeight: 0,
	  heights: [0, 3, 6]
	}), new Elevator({
	  id: 108,
	  baseRowCol: [15, 25],
	  startingHeight: 0,
	  heights: [0, 3, 6]
	}), new Elevator({
	  id: 109,
	  baseRowCol: [9, 21],
	  startingHeight: 0,
	  heights: [0, 3]
	}), new Elevator({
	  id: 109,
	  baseRowCol: [9, 22],
	  startingHeight: 0,
	  heights: [0, 3]
	}), new Elevator({
	  id: 110,
	  baseRowCol: [6, 24],
	  startingHeight: 0,
	  heights: [0, 3]
	}), new Elevator({
	  id: 110,
	  baseRowCol: [6, 25],
	  startingHeight: 0,
	  heights: [0, 3]
	}), new Elevator({
	  id: 111,
	  baseRowCol: [9, 30],
	  startingHeight: 3,
	  heights: [0, 3]
	}), new ExitElevator({
	  id: 101,
	  baseRowCol: [3, 15],
	  startingHeight: 0,
	  heights: [0, 3, 6, 10]
	}), new ExitElevator({
	  id: 101,
	  baseRowCol: [3, 16],
	  startingHeight: 0,
	  heights: [0]
	})];
	
	var cubbies = [new Cubby({
	  id: "C101",
	  rowCol: [8, 3],
	  startItem: new Panel(["E", "S", "W"])
	}), new Cubby({
	  id: "C102",
	  rowCol: [4, 28],
	  startItem: new Panel(["E", "N", "W"])
	}), new Cubby({
	  id: "C103",
	  rowCol: [14, 3],
	  startItem: new Panel(["N", "E"])
	}), new Cubby({
	  id: "C104",
	  rowCol: [14, 28],
	  startItem: new Panel(["N", "S"])
	})];
	
	var powerSources = [new PowerSource({
	  id: "PS101",
	  rowCol: [15, 16]
	}), new PowerSource({
	  id: "PS102",
	  rowCol: [15, 15]
	})];
	
	var wiring = [new Wire({ rowCol: [16, 16], type: "NE" }), new Wire({ rowCol: [16, 17], type: "EW" }), new Wire({ rowCol: [16, 18], type: "EW" }), new Wire({ rowCol: [16, 19], type: "EW" }), new Wire({ rowCol: [16, 20], type: "EW" }), new Wire({ rowCol: [16, 21], type: "EW" }), new Wire({ rowCol: [16, 22], type: "WS" }), new Wire({ rowCol: [17, 22], type: "NE" }), new Wire({ rowCol: [17, 23], type: "EW" }), new Wire({ rowCol: [17, 24], type: "EW" }), new Wire({ rowCol: [17, 25], type: "EW" }), new Wire({ rowCol: [17, 26], type: "EW" }), new Wire({ rowCol: [17, 27], type: "EW" }), new Wire({ rowCol: [17, 28], type: "NW" }), new Wire({ rowCol: [16, 28], type: "NS" }), new Wire({ rowCol: [15, 28], type: "NS" }), new WireJunction({ rowCol: [14, 28], segmentStrings: ["N", "S"] }), new Wire({ rowCol: [13, 28], type: "NS" }), new Wire({ rowCol: [12, 28], type: "NS" }), new Wire({ rowCol: [11, 28], type: "NS" }), new Wire({ rowCol: [10, 28], type: "NS" }), new Wire({ rowCol: [9, 28], type: "NS" }), new Wire({ rowCol: [8, 28], type: "ESW" }), new Wire({ rowCol: [8, 29], type: "NW" }), new Wire({ rowCol: [7, 29], type: "NS" }), new Wire({ rowCol: [6, 29], type: "NS" }), new Wire({ rowCol: [5, 29], type: "NS" }), new Wire({ rowCol: [4, 29], type: "WS" }), new WireJunction({ rowCol: [4, 28], segmentStrings: ["E", "W", "N"] }), new Wire({ rowCol: [4, 27], type: "EW" }), new Wire({ rowCol: [4, 26], type: "EW" }), new Wire({ rowCol: [4, 25], type: "EW" }), new Wire({ rowCol: [4, 24], type: "EW" }), new Wire({ rowCol: [4, 23], type: "EW" }), new Wire({ rowCol: [4, 22], type: "EW" }), new Wire({ rowCol: [4, 21], type: "EW" }), new Wire({ rowCol: [4, 20], type: "EW" }), new Wire({ rowCol: [4, 19], type: "EW" }), new Wire({ rowCol: [4, 18], type: "ES" }), new Wire({ rowCol: [5, 18], type: "NS" }), new Wire({ rowCol: [6, 18], type: "NS" }), new Wire({ rowCol: [7, 18], type: "NS" }), new Wire({ rowCol: [3, 28], type: "NS" }), new Wire({ rowCol: [2, 28], type: "NS" }), new Wire({ rowCol: [1, 28], type: "WS" }), new Wire({ rowCol: [1, 27], type: "EW" }), new Wire({ rowCol: [1, 26], type: "EW" }), new Wire({ rowCol: [1, 25], type: "EW" }), new Wire({ rowCol: [1, 24], type: "EW" }), new Wire({ rowCol: [1, 23], type: "EW" }), new Wire({ rowCol: [1, 22], type: "EW" }), new Wire({ rowCol: [1, 21], type: "EW" }), new Wire({ rowCol: [1, 20], type: "EW" }), new Wire({ rowCol: [1, 19], type: "EW" }), new Wire({ rowCol: [1, 18], type: "EW" }), new Wire({ rowCol: [16, 15], type: "NW" }), new Wire({ rowCol: [16, 14], type: "EW" }), new Wire({ rowCol: [16, 13], type: "EW" }), new Wire({ rowCol: [16, 12], type: "EW" }), new Wire({ rowCol: [16, 11], type: "EW" }), new Wire({ rowCol: [16, 10], type: "EW" }), new Wire({ rowCol: [16, 9], type: "ES" }), new Wire({ rowCol: [17, 9], type: "NW" }), new Wire({ rowCol: [17, 8], type: "EW" }), new Wire({ rowCol: [17, 7], type: "EW" }), new Wire({ rowCol: [17, 6], type: "EW" }), new Wire({ rowCol: [17, 5], type: "EW" }), new Wire({ rowCol: [17, 4], type: "NE" }), new Wire({ rowCol: [16, 4], type: "NS" }), new Wire({ rowCol: [15, 4], type: "NS" }), new Wire({ rowCol: [14, 4], type: "WS" }), new WireJunction({ rowCol: [14, 3], segmentStrings: ["N", "E"] }), new Wire({ rowCol: [13, 3], type: "NS" }), new Wire({ rowCol: [12, 3], type: "NS" }), new Wire({ rowCol: [11, 3], type: "NSE" }), new Wire({ rowCol: [10, 3], type: "NS" }), new Wire({ rowCol: [9, 3], type: "NS" }), new WireJunction({ rowCol: [8, 3], segmentStrings: ["E", "W", "S"] }), new Wire({ rowCol: [8, 2], type: "NE" }), new Wire({ rowCol: [7, 2], type: "NS" }), new Wire({ rowCol: [6, 2], type: "NS" }), new Wire({ rowCol: [5, 2], type: "NS" }), new Wire({ rowCol: [4, 2], type: "NS" }), new Wire({ rowCol: [3, 2], type: "NS" }), new Wire({ rowCol: [2, 2], type: "NS" }), new Wire({ rowCol: [1, 2], type: "ES" }), new Wire({ rowCol: [1, 3], type: "EW" }), new Wire({ rowCol: [1, 4], type: "EW" }), new Wire({ rowCol: [1, 5], type: "EW" }), new Wire({ rowCol: [1, 6], type: "EW" }), new Wire({ rowCol: [1, 7], type: "EW" }), new Wire({ rowCol: [1, 8], type: "EW" }), new Wire({ rowCol: [1, 9], type: "EW" }), new Wire({ rowCol: [1, 10], type: "EW" }), new Wire({ rowCol: [1, 11], type: "EW" }), new Wire({ rowCol: [1, 12], type: "ESW" }), new Wire({ rowCol: [1, 13], type: "EW" }), new Wire({ rowCol: [2, 12], type: "NS" }), new Wire({ rowCol: [3, 12], type: "NS" }), new Wire({ rowCol: [4, 12], type: "NE" }), new Wire({ rowCol: [4, 13], type: "WS" }), new Wire({ rowCol: [5, 13], type: "NS" }), new Wire({ rowCol: [6, 13], type: "NS" }), new Wire({ rowCol: [7, 13], type: "NS" })];
	
	var openGreenDoors = function openGreenDoors(button) {
	  for (var i = 0; i < doors.length; i++) {
	    if (doors[i].color === 'green') {
	      doors[i].open();
	    } else {
	      doors[i].close();
	    }
	  }
	};
	
	var openRedDoors = function openRedDoors(button) {
	  for (var i = 0; i < doors.length; i++) {
	    if (doors[i].color === 'red') {
	      doors[i].open();
	    } else {
	      doors[i].close();
	    }
	  }
	};
	
	var buttonBlocks = [new ButtonBlock({
	  id: "BB101",
	  side: "left",
	  rowCol: [5, 12],
	  color: 'green',
	  func: openGreenDoors
	}), new ButtonBlock({
	  id: "BB102",
	  side: "right",
	  rowCol: [8, 4],
	  func: openRedDoors
	}), new ButtonBlock({
	  id: "BB103",
	  side: "right",
	  rowCol: [8, 4],
	  func: openRedDoors
	}), new ButtonBlock({
	  id: "BB104",
	  side: "right",
	  color: 'green',
	  rowCol: [17, 9],
	  func: openGreenDoors
	}), new ButtonBlock({
	  id: "BB105",
	  side: "right",
	  color: 'green',
	  rowCol: [11, 4], //check
	  func: openGreenDoors
	}), new ButtonBlock({
	  id: "BB106",
	  side: "left",
	  rowCol: [8, 4],
	  func: openRedDoors
	}), new ButtonBlock({
	  id: "BB107",
	  side: "left",
	  rowCol: [17, 22],
	  func: openRedDoors
	}), new ButtonBlock({
	  id: "BB108",
	  side: "left",
	  rowCol: [11, 27],
	  func: openRedDoors
	}), new ButtonBlock({
	  id: "BB109",
	  side: "right",
	  color: 'green',
	  rowCol: [8, 18],
	  func: openGreenDoors
	}), new ButtonBlock({
	  id: "BB110",
	  side: "left",
	  color: 'green',
	  rowCol: [8, 27],
	  func: openGreenDoors
	}), new ButtonBlock({
	  id: "BB111",
	  side: "right",
	  rowCol: [5, 18],
	  func: openRedDoors
	})];
	
	var forceFieldBlocks = [new ForceFieldBlock({
	  id: "FF101",
	  rowCol: [1, 14]
	}), new ForceFieldBlock({
	  id: "FF102",
	  rowCol: [1, 17]
	})];
	
	var foregroundGrid = [builder.rowOf(15, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(15, "block")), builder.rowOf(6, "block").concat(builder.rowOf(7, "")).concat(builder.rowOf(1, "block")).concat([forceFieldBlocks[0]]).concat(builder.rowOf(2, "")).concat([forceFieldBlocks[1]]).concat(builder.rowOf(1, "block")).concat(builder.rowOf(12, "")).concat(builder.rowOf(1, "block")), builder.rowOf(6, "block").concat(builder.rowOf(7, "")).concat(doors[0]).concat("forceField").concat(builder.rowOf(2, "")).concat(["forceField"]).concat(doors[9]).concat(builder.rowOf(7, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(1, "block")), builder.rowOf(6, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(7, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(7, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(1, "block")), builder.rowOf(6, "block").concat(builder.rowOf(8, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(8, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(1, "block")), builder.rowOf(1, "block").concat(builder.rowOf(4, "")).concat([doors[1]]).concat(builder.rowOf(7, "")).concat([buttonBlocks[0]]).concat(builder.rowOf(4, "")).concat([buttonBlocks[10]]).concat(builder.rowOf(7, "")).concat([doors[8]]).concat(builder.rowOf(4, "")).concat(["block"]), builder.rowOf(1, "block").concat(builder.rowOf(1, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(10, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(1, "")).concat(["block"]), builder.rowOf(1, "block").concat(builder.rowOf(4, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(14, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(4, "")).concat(builder.rowOf(1, "block")), builder.rowOf(1, "block").concat(builder.rowOf(3, "")).concat([buttonBlocks[2]]).concat(builder.rowOf(3, "")).concat([doors[2]]).concat(builder.rowOf(4, "")).concat([buttonBlocks[5]]).concat(builder.rowOf(4, "")).concat([buttonBlocks[8]]).concat(builder.rowOf(4, "")).concat([doors[7]]).concat(builder.rowOf(3, "")).concat([buttonBlocks[9]]).concat(builder.rowOf(3, "")).concat(builder.rowOf(1, "block")), builder.rowOf(1, "block").concat(builder.rowOf(1, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(10, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(4, "block")).concat([""]).concat(["block"]), builder.rowOf(6, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(8, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(6, "block")), builder.rowOf(4, "block").concat([buttonBlocks[4]]).concat(builder.rowOf(3, "")).concat(builder.rowOf(16, "block")).concat(builder.rowOf(3, "")).concat([buttonBlocks[7]]).concat(builder.rowOf(4, "block")), builder.rowOf(6, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(16, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(6, "block")), builder.rowOf(1, "block").concat(builder.rowOf(4, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(2, "block")).concat(builder.rowOf(4, "")).concat(["block"]).concat(builder.rowOf(2, "powerBlock")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(2, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(1, "block")), builder.rowOf(1, "block").concat(builder.rowOf(4, "")).concat([doors[3]]).concat(builder.rowOf(3, "")).concat([doors[4]]).concat(builder.rowOf(4, "")).concat(["block"]).concat(builder.rowOf(2, "powerBlock")).concat(["block"]).concat(builder.rowOf(4, "")).concat([doors[5]]).concat(builder.rowOf(3, "")).concat([doors[6]]).concat(builder.rowOf(3, "")).concat([new Spring()]).concat(builder.rowOf(1, "block")), builder.rowOf(6, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(3, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(2, "block")).concat([powerSources[0]]).concat([powerSources[0]]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(3, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(6, "block")), builder.rowOf(9, "block").concat(builder.rowOf(14, "")).concat(builder.rowOf(9, "block")), builder.rowOf(9, "block").concat(buttonBlocks[3]).concat(builder.rowOf(12, "")).concat(buttonBlocks[6]).concat(builder.rowOf(9, "block")), builder.rowOf(11, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(6, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(11, "block")), builder.rowOf(32, "block"), builder.rowOf(32, "block"), builder.rowOf(32, "block")];
	
	var backgroundGrid = [builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick"), builder.rowOf(32, "brick")];
	
	var level = new Level({
	  name: "Level 3",
	  color: '#8B8D9A',
	  foregroundGrid: foregroundGrid,
	  backgroundGrid: backgroundGrid,
	  startingPos: [1000.5, 1275.5],
	  elevators: elevators,
	  doors: doors,
	  cubbies: cubbies,
	  wiring: wiring,
	  powerSources: powerSources,
	  forceFieldBlocks: forceFieldBlocks,
	  buttonBlocks: buttonBlocks
	});
	
	module.exports = level;

/***/ },
/* 22 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var PowerObject = function () {
	  function PowerObject(options) {
	    _classCallCheck(this, PowerObject);
	
	    this.hasPower = false;
	    this.id = options.id;
	    this.rowCol = options.rowCol;
	  }
	
	  _createClass(PowerObject, [{
	    key: "toString",
	    value: function toString() {
	      return this.constructor.name;
	    }
	  }, {
	    key: "sendPower",
	    value: function sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, flowing) {
	
	      var topRowCol = [this.rowCol[0] - 1, this.rowCol[1]];
	      var leftRowCol = [this.rowCol[0], this.rowCol[1] - 1];
	      var rightRowCol = [this.rowCol[0], this.rowCol[1] + 1];
	      var bottomRowCol = [this.rowCol[0] + 1, this.rowCol[1]];
	
	      //if object is a Power Source, send power in all four directions
	      if (this.constructor.name === 'PowerSource') {
	        this.type = "NESW";
	      }
	
	      //look through wires:
	      for (var i = 0; i < wiring.length; i++) {
	        if (this.type.split("").indexOf("W") !== -1) {
	          if (wiring[i].rowCol[0] === leftRowCol[0] && wiring[i].rowCol[1] === leftRowCol[1] && flowing !== "rightward") {
	            wiring[i].hasPower = true;
	            wiring[i].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "leftward");
	          }
	        }
	        if (this.type.split("").indexOf("N") !== -1) {
	          if (wiring[i].rowCol[0] === topRowCol[0] && wiring[i].rowCol[1] === topRowCol[1] && flowing !== "downward") {
	            wiring[i].hasPower = true;
	            wiring[i].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "upward");
	          }
	        }
	        if (this.type.split("").indexOf("E") !== -1) {
	          if (wiring[i].rowCol[0] === rightRowCol[0] && wiring[i].rowCol[1] === rightRowCol[1] && flowing !== "leftward") {
	            wiring[i].hasPower = true;
	            wiring[i].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "rightward");
	          }
	        }
	        if (this.type.split("").indexOf("S") !== -1) {
	          if (wiring[i].rowCol[0] === bottomRowCol[0] && wiring[i].rowCol[1] === bottomRowCol[1] && flowing !== "upward") {
	            wiring[i].hasPower = true;
	            wiring[i].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "downward");
	          }
	        }
	      }
	
	      //look through force field blocks:
	      for (var _i = 0; _i < forceFieldBlocks.length; _i++) {
	        if (forceFieldBlocks[_i].rowCol[0] === leftRowCol[0] && forceFieldBlocks[_i].rowCol[1] === leftRowCol[1]) {
	          forceFieldBlocks[_i].hasPower = true;
	        }
	        if (forceFieldBlocks[_i].rowCol[0] === topRowCol[0] && forceFieldBlocks[_i].rowCol[1] === topRowCol[1]) {
	          forceFieldBlocks[_i].hasPower = true;
	        }
	        if (forceFieldBlocks[_i].rowCol[0] === rightRowCol[0] && forceFieldBlocks[_i].rowCol[1] === rightRowCol[1]) {
	          forceFieldBlocks[_i].hasPower = true;
	        }
	        if (forceFieldBlocks[_i].rowCol[0] === bottomRowCol[0] && forceFieldBlocks[_i].rowCol[1] === bottomRowCol[1]) {
	          forceFieldBlocks[_i].hasPower = true;
	        }
	      }
	
	      //look through button blocks:
	      for (var _i2 = 0; _i2 < buttonBlocks.length; _i2++) {
	        if (buttonBlocks[_i2].rowCol[0] === leftRowCol[0] && buttonBlocks[_i2].rowCol[1] === leftRowCol[1]) {
	          buttonBlocks[_i2].hasPower = true;
	        }
	        if (buttonBlocks[_i2].rowCol[0] === topRowCol[0] && buttonBlocks[_i2].rowCol[1] === topRowCol[1]) {
	          buttonBlocks[_i2].hasPower = true;
	        }
	        if (buttonBlocks[_i2].rowCol[0] === rightRowCol[0] && buttonBlocks[_i2].rowCol[1] === rightRowCol[1]) {
	          buttonBlocks[_i2].hasPower = true;
	        }
	        if (buttonBlocks[_i2].rowCol[0] === bottomRowCol[0] && buttonBlocks[_i2].rowCol[1] === bottomRowCol[1]) {
	          buttonBlocks[_i2].hasPower = true;
	        }
	      }
	    }
	  }]);
	
	  return PowerObject;
	}();
	
	module.exports = PowerObject;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map