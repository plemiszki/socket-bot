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
      } else if (currentLevel.foregroundGrid[row][col].toString() === "buttonBlock") {
        this.drawButtonBlock(currentLevel.foregroundGrid[row][col],[x_block, y_block])
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
