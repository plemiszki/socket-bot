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
