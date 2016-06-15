var PowerObject = require('./powerObject');

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
