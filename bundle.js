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

	var currentLevel = __webpack_require__(1);
	var Renderer = __webpack_require__(3)

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
	  if (39 in keysDown) { //right
	    if (levelWidth - origin[0] < BLOCK_LENGTH * 8) {
	      origin[0] = levelWidth - (BLOCK_LENGTH * 8);
	      // todo: move robot by the difference?
	    } else if (robot.x === 263.5 && (levelWidth - origin[0]) > (BLOCK_LENGTH * 8)) {
	      origin[0] += robot.speed * modifier;
	    } else if (robot.x > 263.5 && (levelWidth - origin[0]) > (BLOCK_LENGTH * 8)) {
	      robot.x = 263.5;
	      origin[0] += robot.speed * modifier;
	    } else {
	      robot.x += robot.speed * modifier;
	    }
	  } else if (37 in keysDown) { //left
	    if (origin[0] < 0) {
	      origin[0] = 0;
	    } else if (robot.x === 263.5 && origin[0] > 0) {
	      origin[0] -= robot.speed * modifier;
	    } else if (robot.x < 263.5 && origin[0] > 0) {
	      robot.x = 263.5;
	      origin[0] -= robot.speed * modifier;
	    } else {
	      robot.x -= robot.speed * modifier;
	    }
	  }
	  if (40 in keysDown) { //down
	    if (levelHeight - origin[1] < BLOCK_LENGTH * 6) {
	      origin[1] = levelHeight - (BLOCK_LENGTH * 6);
	      // todo: move robot by the difference?
	    } else if (robot.y === 187.5 && (levelHeight - origin[1]) > (BLOCK_LENGTH * 6)) {
	      origin[1] += robot.speed * modifier;
	    } else if (robot.y > 187.5 && (levelHeight - origin[1]) > (BLOCK_LENGTH * 6)) {
	      robot.y = 187.5;
	      origin[1] += robot.speed * modifier;
	    } else {
	      robot.y += robot.speed * modifier;
	    }
	  } else if (38 in keysDown) { //up
	    if (origin[1] < 0) {
	      origin[1] = 0;
	    } else if (robot.y === 187.5 && origin[1] > 0) {
	      origin[1] -= robot.speed * modifier;
	    } else if (robot.y < 187.5 && origin[1] > 0) {
	      robot.y = 187.5;
	      origin[1] -= robot.speed * modifier;
	    } else {
	      robot.y -= robot.speed * modifier;
	    }
	  }
	  var coords = document.getElementById("coords");
	  coords.innerHTML = "Right Side: " + robot.x;
	};

	var main = function () {
	  var now = Date.now();
	  var delta = now - then;
	  update(delta / 1000);
	  renderScreen();
	  then = now;
	  window.requestAnimationFrame(main);
	};

	var renderScreen = function () {
	  renderBackground(origin);
	  renderForeground(origin);
	  robot.draw();
	}

	addEventListener("keydown", function (e) {
	  keysDown[e.keyCode] = true;
	  // console.log(keysDown);
	}, false);

	addEventListener("keyup", function (e) {
	  delete keysDown[e.keyCode];
	  // console.log(keysDown);
	}, false);

	function renderBackground(origin) {
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
	        renderer.drawBrick([x_block, y_block], '#39a33c', leftEdges);
	      }

	      col_left_x += 75;
	    }

	    row_top_y += 75;
	  }
	}

	function renderForeground(origin) {
	  var row_top_y = 0;
	  for (var row = 0; row < currentLevel.foregroundGrid.length; row++) {
	    var col_left_x = 0;
	    for (var col = 0; col < currentLevel.foregroundGrid[row].length; col++) {

	      var x_block = (-1 * origin[0]) + col_left_x + 0.5;
	      var y_block = (-1 * origin[1]) + row_top_y + 0.5;

	      if (currentLevel.foregroundGrid[row][col] === "block") {
	        renderer.drawBlock([x_block, y_block]);
	      }

	      col_left_x += 75;
	    }

	    row_top_y += 75;
	  }
	}

	var canvas = document.getElementById('canvas');
	var c = canvas.getContext("2d");
	var renderer = new Renderer(c);
	var origin = [0,0];
	var robot = new Robot([0.5,0.5]);
	var keysDown = {};
	var then = Date.now();
	document.addEventListener("DOMContentLoaded", function () {
	  main();
	})


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


/***/ }
/******/ ]);