const BLOCK_LENGTH = 75;

function Renderer(context, game) {
  this.c = context;
  this.game = game;
}

Renderer.prototype.renderScreen = function (robot) {
  this.renderBackground(this.game.origin, this.game.currentLevel);
  this.renderForeground(this.game.origin, this.game.currentLevel);
  robot.draw();
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
