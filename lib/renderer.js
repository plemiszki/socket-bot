const BLOCK_LENGTH = 75;
const EDGE_TO_INNER = 8;
const INNER_RECT_LENGTH = BLOCK_LENGTH - (EDGE_TO_INNER * 2);
var Wire = require('./wire.js');
var WireJunction = require('./wireJunction.js');
var Robot = require('./robot.js');
var Door = require('./door.js');
var ButtonBlock = require('./buttonBlock.js');
var Cubby = require('./cubby.js');
var Panel = require('./panel.js');

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
    if (this.game.currentLevel.messages) { this.renderMessage(this.game.currentLevel.messages); }
    if (this.game.currentLevel.name && this.showLevelName) { this.renderLevelName(); }
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
    if (messages[i].left <= leftCol && messages[i].right >= rightCol
    && messages[i].top <= topRow && messages[i].bottom >= bottomRow) {
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
  var menuRobot = new Robot([413.5, 120.5]);
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
  if (topRow === -1) { topRow = 0; }
  var bottomRow = Math.floor((origin[1] + (BLOCK_LENGTH * 6) - 1) / BLOCK_LENGTH);
  if (bottomRow >= this.game.currentLevel.foregroundGrid.length) { bottomRow = this.game.currentLevel.foregroundGrid.length - 1; }
  var leftCol = Math.floor(origin[0] / BLOCK_LENGTH) - 1;
  if (leftCol < 0) { leftCol = 0; }
  var rightCol = Math.floor((origin[0] + (BLOCK_LENGTH * 8) - 1) / BLOCK_LENGTH) + 1;
  if (rightCol >= this.game.currentLevel.foregroundGrid[0].length) { rightCol = this.game.currentLevel.foregroundGrid[0].length - 1; }

  return [topRow, leftCol, bottomRow, rightCol];
};

Renderer.prototype.renderForeground = function (origin, currentLevel, cornerSquares) {
  var rowTopY = cornerSquares[0] * BLOCK_LENGTH;
  for (var row = cornerSquares[0]; row <= cornerSquares[2]; row++) {
    var colLeftX = cornerSquares[1] * BLOCK_LENGTH;
    for (var col = cornerSquares[1]; col <= cornerSquares[3]; col++) {
      let xBlock = (-1 * origin[0]) + colLeftX + 0.5;
      var yBlock = (-1 * origin[1]) + rowTopY + 0.5;
      if (currentLevel.foregroundGrid[row][col] === "block") {
        this.drawBlock([xBlock, yBlock]);
      } else if (currentLevel.foregroundGrid[row][col] === "platform") {
        this.drawPlatform([xBlock, yBlock], '#2c2929', '#161515');
      } else if (currentLevel.foregroundGrid[row][col].toString() === "door") {
        this.drawDoor(currentLevel.foregroundGrid[row][col],[xBlock, yBlock]);
      } else if (currentLevel.foregroundGrid[row][col].toString() === "ButtonBlock") {
        this.drawButtonBlock(currentLevel.foregroundGrid[row][col],[xBlock, yBlock]);
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
  let rowTopY = cornerSquares[0] * BLOCK_LENGTH;
  for (let row = cornerSquares[0]; row <= cornerSquares[2]; row++) {
    let colLeftX = cornerSquares[1] * BLOCK_LENGTH;
    for (let col = cornerSquares[1]; col <= cornerSquares[3]; col++) {
      if (currentLevel.foregroundGrid[row][col] === "block") {
        colLeftX += 75;
        continue; //skip - there's a foreground block covering this square
      }
      let xBlock = (-1 * origin[0]) + colLeftX + 0.5;
      let yBlock = (-1 * origin[1]) + rowTopY + 0.5;
      if (currentLevel.backgroundGrid[row][col] === "brick"){
        let leftEdges = currentLevel.foregroundGrid[row][col - 1] !== "block";
        this.drawBrick([xBlock, yBlock], currentLevel.color, leftEdges);
      }

      colLeftX += 75;
    }

    rowTopY += 75;
  }
};

Renderer.prototype.renderElevators = function (origin, currentLevel, cornerSquares) {
  let colLeftX = cornerSquares[1] * BLOCK_LENGTH;
  //iterate through each visible column:
  for (let col = cornerSquares[1]; col <= cornerSquares[3]; col++) {
    //iterate through elevators to see if there's one in this column:
    for (let elv = 0; elv < currentLevel.elevators.length; elv++) {
      if (currentLevel.elevators[elv].col === col) {
        //if so, find where the top is:
        let topRow = currentLevel.elevators[elv].topRow;
        let additionalPixels = currentLevel.elevators[elv].additionalPixels;
        let xBlock = (-1 * origin[0]) + colLeftX + 0.5;
        let platformTopY = (BLOCK_LENGTH * topRow) - origin[1] + 0.5;
        let adjustedPlatformTop = platformTopY - additionalPixels;
        //and the bottom
        let realBaseBottomY = ((currentLevel.elevators[elv].baseRow + 1) * BLOCK_LENGTH) + 0.5;
        let relBaseBottomY = realBaseBottomY - origin[1];
        this.drawElevator(xBlock, adjustedPlatformTop, relBaseBottomY, currentLevel.elevators[elv].exit);
      }
    }

    colLeftX += 75;
  }
};

Renderer.prototype.drawElevator = function (xBlock, adjustedPlatformTop, relBaseBottomY, exit) {
  const COLUMN_WIDTH = 25;
  const inset = Math.floor((BLOCK_LENGTH - COLUMN_WIDTH) / 2);
  let columnTopY = adjustedPlatformTop + Math.floor(BLOCK_LENGTH / 3);
  let height = relBaseBottomY - columnTopY;
  if (450 - columnTopY < height) {
    height = 450 - columnTopY;
  }
  const grad = this.c.createLinearGradient(xBlock + inset, 0, xBlock + inset + COLUMN_WIDTH, 0);
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
  for (let i = 0; i < objects.length; i++) {
    if (objects[i].rowCol[0] >= cornerSquares[0] &&
        objects[i].rowCol[1] >= cornerSquares[1] &&
        objects[i].rowCol[0] <= cornerSquares[2] &&
        objects[i].rowCol[1] <= cornerSquares[3]
    ) {
      let xBlock = (BLOCK_LENGTH * objects[i].rowCol[1]) - origin[0] + 0.5;
      let yBlock = (BLOCK_LENGTH * objects[i].rowCol[0]) - origin[1] + 0.5;
      if (objects[i] instanceof Wire) {
        this.drawWire([xBlock, yBlock], objects[i]);
      } else if (objects[i] instanceof WireJunction) {
        this.drawWireJunction([xBlock, yBlock], objects[i]);
      } else if (objects[i] instanceof Cubby) {
        this.drawCubby([xBlock, yBlock], objects[i]);
      }
    }
  }
};

Renderer.prototype.renderRobot = function (robot) {
  let leftWheelCenter = [robot.pos[0] + 5, robot.pos[1] + BLOCK_LENGTH - 5];
  let rightWheelCenter = [robot.pos[0] + BLOCK_LENGTH - 6, robot.pos[1] + BLOCK_LENGTH - 5];
  let bottomBarTop = leftWheelCenter[1] - 6;
  let headBottom = robot.pos[1] + 10 - robot.height + 54;
  this.drawDot([robot.pos[0] + (BLOCK_LENGTH / 2), bottomBarTop - ((bottomBarTop - headBottom) / 4)]);
  this.drawDot([robot.pos[0] + 15, bottomBarTop - ((bottomBarTop - headBottom) / 2)]);
  this.drawDot([robot.pos[0] + BLOCK_LENGTH - 15, bottomBarTop - ((bottomBarTop - headBottom) / 2)]);
  this.drawDot([robot.pos[0] + (BLOCK_LENGTH / 2), bottomBarTop - ((bottomBarTop - headBottom) / 4 * 3)]);
  this.drawLine([robot.pos[0] + 15, bottomBarTop], [robot.pos[0] + BLOCK_LENGTH - 15, bottomBarTop - ((bottomBarTop - headBottom) / 2)]);
  this.drawLine([robot.pos[0] + BLOCK_LENGTH - 15, bottomBarTop], [robot.pos[0] + 15, bottomBarTop - ((bottomBarTop - headBottom) / 2)]);
  this.drawLine([robot.pos[0] + 15, bottomBarTop - ((bottomBarTop - headBottom) / 2)], [robot.pos[0] + BLOCK_LENGTH - 15, headBottom]);
  this.drawLine([robot.pos[0] + BLOCK_LENGTH - 15, bottomBarTop - ((bottomBarTop - headBottom) / 2)], [robot.pos[0] + 15, headBottom]);
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
  this.c.arc(
    leftWheelCenter[0],
    leftWheelCenter[1],
    8, 1.5 * Math.PI, 2 * Math.PI, false
  );
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
  this.c.arc(
    rightWheelCenter[0],
    rightWheelCenter[1],
    8, Math.PI, 1.5 * Math.PI, false
  );
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
    var doorHalfHeight = ((BLOCK_LENGTH - 1) - openSpace) / 2;
    if (doorHalfHeight < -1) { doorHalfHeight = -1; }
    var negPercent = (door.percentOpen - 1);
    var negToothHeight = 0;
    if (negPercent >= 0) {
      negToothHeight = (BLOCK_LENGTH - 1) * negPercent / 2;
    }

    this.c.beginPath();
    this.c.moveTo(topLeftCorner[0], topLeftCorner[1] - 1);
    this.c.lineTo(topLeftCorner[0] + width, topLeftCorner[1] - 1);
    this.c.lineTo(topLeftCorner[0] + width, topLeftCorner[1] + doorHalfHeight);
    this.c.lineTo(topLeftCorner[0] + ((4 / 5) * width), topLeftCorner[1] + doorHalfHeight);
    var topHeight = topLeftCorner[1] + doorHalfHeight + TOOTH_HEIGHT - negToothHeight;
    if (topHeight < topLeftCorner[1] - 1) { topHeight = topLeftCorner[1] - 1; }
    this.c.lineTo(topLeftCorner[0] + ((4 / 5) * width), topHeight);
    this.c.lineTo(topLeftCorner[0] + ((1 / 5) * width), topHeight);
    this.c.lineTo(topLeftCorner[0] + ((1 / 5) * width), topLeftCorner[1] + doorHalfHeight);
    this.c.lineTo(topLeftCorner[0], topLeftCorner[1] + doorHalfHeight);
    this.c.closePath();
    this.c.fillStyle = door.color;
    this.c.fill();
    this.c.strokeStyle = 'black';
    this.c.stroke();

    this.c.beginPath();
    this.c.moveTo(topLeftCorner[0], topLeftCorner[1] + BLOCK_LENGTH - 1 - doorHalfHeight);
    this.c.lineTo(topLeftCorner[0] + ((1 / 5) * width), topLeftCorner[1] + BLOCK_LENGTH - 1 - doorHalfHeight);
    this.c.lineTo(topLeftCorner[0] + ((1 / 5) * width), topLeftCorner[1] + BLOCK_LENGTH - 1 - doorHalfHeight + TOOTH_HEIGHT);
    this.c.lineTo(topLeftCorner[0] + ((4 / 5) * width), topLeftCorner[1] + BLOCK_LENGTH - 1 - doorHalfHeight + TOOTH_HEIGHT);
    this.c.lineTo(topLeftCorner[0] + ((4 / 5) * width), topLeftCorner[1] + BLOCK_LENGTH - 1 - doorHalfHeight);
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
      x: pos[0] + (BLOCK_LENGTH / 2) - 4.5,
      y: pos[1] - 0.5,
      width: 9,
      height: (BLOCK_LENGTH / 2) - 4.5,
      fill: wireJunction.segments["N"].hasPower ? this.gradientArray[this.gradientIndex] : '#333',
      stroke: 'none'
    });
  }
  if (wireJunction.segments["E"]) {
    this.drawRectangle({ // E
      x: pos[0] + (BLOCK_LENGTH / 2) + 4.5,
      y: pos[1] + (BLOCK_LENGTH / 2) - 4.5,
      width: (BLOCK_LENGTH / 2) - 4.5,
      height: 9,
      fill: wireJunction.segments["E"].hasPower ? this.gradientArray[this.gradientIndex] : '#333',
      stroke: 'none'
    });
  }
  if (wireJunction.segments["S"]) {
    this.drawRectangle({ // S
      x: pos[0] + (BLOCK_LENGTH / 2) - 4.5,
      y: pos[1] + (BLOCK_LENGTH / 2) + 4.5,
      width: 9,
      height: (BLOCK_LENGTH / 2) - 4.5,
      fill: wireJunction.segments["S"].hasPower ? this.gradientArray[this.gradientIndex] : '#333',
      stroke: 'none'
    });
  }
  if (wireJunction.segments["W"]) {
    this.drawRectangle({ // W
      x: pos[0] - 0.5,
      y: pos[1] + (BLOCK_LENGTH / 2) - 4.5,
      width: (BLOCK_LENGTH / 2) - 4.5,
      height: 9,
      fill: wireJunction.segments["W"].hasPower ? this.gradientArray[this.gradientIndex] : '#333',
      stroke: 'none'
    });
  }
};

Renderer.prototype.drawWire = function (pos, wire) {
  let fill = wire.hasPower ? this.gradientArray[this.gradientIndex] : '#333';
  if (wire.type === "EW") {
    this.drawRectangle({
      x: pos[0] - 0.5,
      y: pos[1] + (BLOCK_LENGTH / 2) - 4.5,
      width: BLOCK_LENGTH + 0.5,
      height: 9,
      fill: fill,
      stroke: 'none'
    });
  } else if (wire.type === "NS") {
    this.drawRectangle({
      x: pos[0] + (BLOCK_LENGTH / 2) - 4.5,
      y: pos[1] - 0.5,
      width: 9,
      height: BLOCK_LENGTH + 0.5,
      fill: fill,
      stroke: 'none'
    });
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
  } else if (wire.type === "ESW") {
    this.c.beginPath();
    this.c.moveTo(pos[0] - 0.5, pos[1] + (BLOCK_LENGTH / 2) - 4.5);
    this.c.lineTo(pos[0] + BLOCK_LENGTH, pos[1] + (BLOCK_LENGTH / 2) - 4.5);
    this.c.lineTo(pos[0] + BLOCK_LENGTH, pos[1] + (BLOCK_LENGTH / 2) + 4.5);
    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) + 4.5, pos[1] + (BLOCK_LENGTH / 2) + 4.5);
    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) + 4.5, pos[1] + BLOCK_LENGTH);
    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) - 4.5, pos[1] + BLOCK_LENGTH);
    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) - 4.5, pos[1] + (BLOCK_LENGTH / 2) + 4.5);
    this.c.lineTo(pos[0] - 0.5, pos[1] + (BLOCK_LENGTH / 2) + 4.5);
    this.c.closePath();
    this.c.fillStyle = fill;
    this.c.fill();
  } else if (wire.type === "WS") {
    this.c.beginPath();
    this.c.moveTo(pos[0] - 0.5, pos[1] + (BLOCK_LENGTH / 2) - 4.5);
    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) + 4.5, pos[1] + (BLOCK_LENGTH / 2) - 4.5);
    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) + 4.5, pos[1] + BLOCK_LENGTH);
    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) - 4.5, pos[1] + BLOCK_LENGTH);
    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) - 4.5, pos[1] + BLOCK_LENGTH / 2 + 4.5);
    this.c.lineTo(pos[0] - 0.5, pos[1] + BLOCK_LENGTH / 2 + 4.5);
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
  } else if (wire.type === "NW") {
    this.c.beginPath();
    this.c.moveTo(pos[0] + (BLOCK_LENGTH / 2) - 4.5, pos[1] - 0.5);
    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) - 4.5, pos[1] + (BLOCK_LENGTH / 2) - 4.5);
    this.c.lineTo(pos[0] - 0.5, pos[1] + (BLOCK_LENGTH / 2) - 4.5);
    this.c.lineTo(pos[0] - 0.5, pos[1] + (BLOCK_LENGTH / 2) + 4.5);
    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) + 4.5, pos[1] + (BLOCK_LENGTH / 2) + 4.5);
    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) + 4.5, pos[1] - 0.5);
    this.c.fillStyle = fill;
    this.c.fill();
  } else if (wire.type === "NSW") {
    this.drawRectangle({
      x: pos[0] + (BLOCK_LENGTH / 2) - 4.5,
      y: pos[1] - 0.5,
      width: 9,
      height: BLOCK_LENGTH + 0.5,
      fill: fill,
      stroke: 'none'
    });
    this.c.beginPath();
    this.c.moveTo(pos[0] - 0.5, pos[1] + (BLOCK_LENGTH / 2) - 4.5);
    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2), pos[1] + (BLOCK_LENGTH / 2) - 4.5);
    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2), pos[1] + (BLOCK_LENGTH / 2) + 4.5);
    this.c.lineTo(pos[0] - 0.5, pos[1] + (BLOCK_LENGTH / 2) + 4.5);
    this.c.closePath();
    this.c.fillStyle = fill;
    this.c.fill();
  } else if (wire.type === "NSE") {
    this.drawRectangle({
      x: pos[0] + (BLOCK_LENGTH / 2) - 4.5,
      y: pos[1] - 0.5,
      width: 9,
      height: BLOCK_LENGTH + 0.5,
      fill: fill,
      stroke: 'none'
    });
    this.c.beginPath();
    this.c.moveTo(pos[0] + (BLOCK_LENGTH / 2) + 4, pos[1] + (BLOCK_LENGTH / 2) - 4.5);
    this.c.lineTo(pos[0] + BLOCK_LENGTH + 0.5, pos[1] + (BLOCK_LENGTH / 2) - 4.5);
    this.c.lineTo(pos[0] + BLOCK_LENGTH + 0.5, pos[1] + (BLOCK_LENGTH / 2) + 4.5);
    this.c.lineTo(pos[0] + (BLOCK_LENGTH / 2) + 4, pos[1] + (BLOCK_LENGTH / 2) + 4.5);
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
  var rowHeight = (BLOCK_LENGTH / 4);
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
  var buttonPanelY = pos[1] + ((BLOCK_LENGTH - this.BUTTON_PANEL_HEIGHT) / 2) + 0.5;
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
  this.c.arc(
    pos[0],
    pos[1],
    4, Math.PI, 2 * Math.PI, false
  );
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
  this.c.arc(
    options.pos[0],
    options.pos[1],
    options.radius, 0, 2 * Math.PI, false
  );
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
  this.c.rect(x + thickness, y + thickness, width - (thickness * 2), height - (thickness * 2));
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
  this.gradientIndex = this.gradientIndex + (1 * this.gradientSign);
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
  let returnArray = [rgbColor];
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
    return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
};

module.exports = Renderer;
