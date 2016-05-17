var currentLevel = require('./testLevel.js');

var canvas = document.getElementById('canvas');
var c = canvas.getContext("2d");

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
    drawOuterSquare([this.x, this.y], 'red');
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
      console.log("wat?");
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
};

var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  renderScreen();
  robot.draw();
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
        drawBrick([x_block, y_block], '#39a33c', leftEdges);
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
        drawBlock([x_block, y_block]);
      }

      col_left_x += 75;
    }

    row_top_y += 75;
  }
}

function drawBrick(pos, color, leftEdges) {
  var x = pos[0];
  var y = pos[1];
  var rowHeight = (BLOCK_LENGTH / 4);
  drawOuterSquare(pos, color, color);
  c.strokeStyle = '#000';
  for (var i = 0; i < 4; i++) {
    var thisRowY = Math.floor(y + (rowHeight * i)) + 0.5;
    drawLine([x, thisRowY], [x + BLOCK_LENGTH - 0.5, thisRowY]);
    if (i % 2 == 0) {
      if (leftEdges === true) {
        drawLine([x, thisRowY], [x, thisRowY + rowHeight - 0.5]);
      }
      drawLine(
        [x + (BLOCK_LENGTH / 2) + 0.5, thisRowY],
        [x + (BLOCK_LENGTH / 2) + 0.5, thisRowY + rowHeight - 0.5]
      );
    } else {
      drawLine(
        [Math.floor(x + (BLOCK_LENGTH / 4)) + 0.5, thisRowY],
        [Math.floor(x + (BLOCK_LENGTH / 4)) + 0.5, thisRowY + rowHeight - 0.5]
      );
      drawLine(
        [Math.floor(x + (BLOCK_LENGTH / 4) * 3) + 0.5, thisRowY],
        [Math.floor(x + (BLOCK_LENGTH / 4) * 3) + 0.5, thisRowY + rowHeight - 0.5]
      );
    }
  }
}

function drawBlock(pos) {
  var x = pos[0];
  var y = pos[1];
  var frontGrad = c.createLinearGradient(x, y, x, y + 75);
  frontGrad.addColorStop(0, '#2c2929');
  frontGrad.addColorStop(1, '#161515');
  var backGrad = c.createLinearGradient(x, y, x, y + 75);
  backGrad.addColorStop(0, '#292626');
  backGrad.addColorStop(1, '#000000');

  drawOuterSquare(pos, '#000', frontGrad);

  const EDGE_TO_INNER = 8;
  const TRI_LENGTH = 40;
  const INNER_RECT_LENGTH = BLOCK_LENGTH - (EDGE_TO_INNER * 2);
  const START_TRIANGLE = EDGE_TO_INNER + ((INNER_RECT_LENGTH - TRI_LENGTH) / 2);

  //left triangle
  c.fillStyle = backGrad;
  c.beginPath();
  c.moveTo(x + EDGE_TO_INNER, y + START_TRIANGLE);
  c.lineTo(x + EDGE_TO_INNER, y + START_TRIANGLE + TRI_LENGTH);
  c.lineTo(x + EDGE_TO_INNER + (TRI_LENGTH / 2), y + START_TRIANGLE + (TRI_LENGTH / 2));
  c.closePath();
  c.fill();
  c.stroke();

  //top triangle
  c.beginPath();
  c.moveTo(x + START_TRIANGLE, y + EDGE_TO_INNER);
  c.lineTo(x + START_TRIANGLE + TRI_LENGTH, y + EDGE_TO_INNER);
  c.lineTo(x + START_TRIANGLE + (TRI_LENGTH / 2), y + EDGE_TO_INNER + (TRI_LENGTH / 2));
  c.closePath();
  c.fill();
  c.stroke();

  //right triangle
  c.beginPath();
  c.moveTo(x + BLOCK_LENGTH - EDGE_TO_INNER, y + START_TRIANGLE);
  c.lineTo(x + BLOCK_LENGTH - EDGE_TO_INNER, y + START_TRIANGLE + TRI_LENGTH);
  c.lineTo(x + BLOCK_LENGTH - EDGE_TO_INNER - (TRI_LENGTH / 2), y + START_TRIANGLE + (TRI_LENGTH / 2));
  c.closePath();
  c.fill();
  c.stroke();

  //bottom triangle
  c.beginPath();
  c.moveTo(x + START_TRIANGLE, y + BLOCK_LENGTH - EDGE_TO_INNER);
  c.lineTo(x + START_TRIANGLE + TRI_LENGTH, y + BLOCK_LENGTH - EDGE_TO_INNER);
  c.lineTo(x + START_TRIANGLE + (TRI_LENGTH / 2), y + BLOCK_LENGTH - EDGE_TO_INNER - (TRI_LENGTH / 2));
  c.closePath();
  c.fill();
  c.stroke();
}

function drawOuterSquare(pos, stroke, fill) {
  var x = pos[0];
  var y = pos[1];
  c.beginPath();
  c.moveTo(x, y);
  c.lineTo(x + BLOCK_LENGTH - 1, y);
  c.lineTo(x + BLOCK_LENGTH - 1, y + BLOCK_LENGTH - 1);
  c.lineTo(x, y + BLOCK_LENGTH - 1);
  c.closePath();
  c.strokeStyle = stroke;
  c.lineWidth = 1;
  c.stroke();
  if(fill != undefined){
    c.fillStyle = fill;
    c.fill();
  }
}

function drawLine(start, finish) {
  c.beginPath();
  c.moveTo(start[0], start[1]);
  c.lineTo(finish[0], finish[1]);
  c.lineWidth = 1;
  c.stroke();
}

var origin = [0,0];
var robot = new Robot([0.5,0.5]);
var keysDown = {};
var then = Date.now();
main();
