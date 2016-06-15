var PowerObject = require('./powerObject');

function PowerSource(options) {
  this.initializePowerObject(options);
  this.id = options.id;
  this.toString = function () { return "powerSource" };
}

var Surrogate = function () {};
Surrogate.prototype = PowerObject.prototype;
PowerSource.prototype = new Surrogate();
PowerSource.prototype.constructor = PowerSource;


PowerSource.prototype.sendPower = function (wiring, buttonBlocks, forcefieldBlocks) {
  var topRowCol = [this.rowCol[0] - 1, this.rowCol[1]];
  var leftRowCol = [this.rowCol[0], this.rowCol[1] - 1];
  var rightRowCol = [this.rowCol[0], this.rowCol[1] + 1];
  var bottomRowCol = [this.rowCol[0] + 1, this.rowCol[1]];

  //look through wires:
  for (var i = 0; i < wiring.length; i++) {
    if (wiring[i].rowCol[0] === leftRowCol[0] && wiring[i].rowCol[1] === leftRowCol[1]) {
      wiring[i].hasPower = true;
      wiring[i].sendPower(wiring, buttonBlocks, forcefieldBlocks, "left");
    }
  }
}

module.exports = PowerSource;
