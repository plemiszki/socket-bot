function PowerObject() {
}

PowerObject.prototype.initializePowerObject = function (options) {
  this.hasPower = false;
  if (options) {
    this.rowCol = options.rowCol;
  }
};

PowerObject.prototype.getPowerStatus = function () {
  return (this.hasPower)
};

PowerObject.prototype.sendPower = function (wiring, cubbies, buttonBlocks, forcefieldBlocks) {
  var topRowCol = [this.rowCol[0] - 1, this.rowCol[1]];
  var leftRowCol = [this.rowCol[0], this.rowCol[1] - 1];
  var rightRowCol = [this.rowCol[0], this.rowCol[1] + 1];
  var bottomRowCol = [this.rowCol[0] + 1, this.rowCol[1]];

  //look through wires:
  for (var i = 0; i < wiring.length; i++) {
    if (wiring[i].rowCol[0] === leftRowCol[0] && wiring[i].rowCol[1] === leftRowCol[1]) {
      wiring[i].hasPower = true;
      wiring[i].sendPower(wiring, cubbies, buttonBlocks, forcefieldBlocks, "leftward");
    } else if (wiring[i].rowCol[0] === bottomRowCol[0] && wiring[i].rowCol[1] === bottomRowCol[1]) {
      wiring[i].hasPower = true;
      wiring[i].sendPower(wiring, cubbies, buttonBlocks, forcefieldBlocks, "downward");
    } else if (wiring[i].rowCol[0] === rightRowCol[0] && wiring[i].rowCol[1] === rightRowCol[1]) {
      wiring[i].hasPower = true;
      wiring[i].sendPower(wiring, cubbies, buttonBlocks, forcefieldBlocks, "rightward");
    } else if (wiring[i].rowCol[0] === topRowCol[0] && wiring[i].rowCol[1] === topRowCol[1]) {
      wiring[i].hasPower = true;
      wiring[i].sendPower(wiring, cubbies, buttonBlocks, forcefieldBlocks, "upward");
    }
  }
}

module.exports = PowerObject;
