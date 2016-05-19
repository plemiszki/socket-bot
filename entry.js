var currentLevel = require('./testLevel.js');
var Renderer = require('./renderer.js')

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
