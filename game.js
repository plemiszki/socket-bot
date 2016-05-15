var canvas = document.getElementById('canvas');
var c = canvas.getContext("2d");

const BLOCK_LENGTH = 75;

var grid = [
  ["block", "", "", "", "block", "block", "block", "block"],
  ["block", "", "", "", "block", "block", "block", "block"],
  ["block", "", "", "", "block", "block", "block", "block"],
  ["block", "", "", "", "block", "block", "block", "block"],
  ["block", "robot", "", "", "", "", "", ""],
  ["block", "block", "block", "block", "block", "block", "block", "block", "block"]
]

renderForeground([100, 100]);

var keysDown = {};

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
  console.log(keysDown);
}, false);

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
  console.log(keysDown);
}, false);

function renderForeground(origin) {
  var row_top_y = 0;
  for (var row = 0; row < grid.length; row++) {
    var col_left_x = 0;
    for (var col = 0; col < grid[row].length; col++) {

      var x_block = (-1 * origin[0]) + col_left_x + 0.5;
      var y_block = (-1 * origin[1]) + row_top_y + 0.5;

      if (grid[row][col] === "block") {
        drawBlock([x_block, y_block]);
      } else if(grid[row][col] === "robot"){
        drawRobot([x_block, y_block]);
      }
      col_left_x += 75;
    }
    row_top_y += 75;
  }
}

function drawRobot(pos) {
  var x = pos[0];
  var y = pos[1];
  drawOuterSquare(pos, 'red');
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

  drawOuterSquare(pos, '#000', frontGrad)

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
