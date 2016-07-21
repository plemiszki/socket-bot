function PowerObject() {}

PowerObject.prototype.initializePowerObject = function (options) {
  this.hasPower = false;
  this.id = options.id;
  this.rowCol = options.rowCol;
  this.toString = () => this.constructor.name;
};

PowerObject.prototype.sendPower = function (wiring, cubbies, buttonBlocks, forceFieldBlocks, flowing) {

  let topRowCol = [this.rowCol[0] - 1, this.rowCol[1]];
  let leftRowCol = [this.rowCol[0], this.rowCol[1] - 1];
  let rightRowCol = [this.rowCol[0], this.rowCol[1] + 1];
  let bottomRowCol = [this.rowCol[0] + 1, this.rowCol[1]];

  //if object is a Power Source, send power in all four directions
  if (this.constructor.name === 'PowerSource') {
    this.type = "NESW";
  }

  //look through wires:
  for (let i = 0; i < wiring.length; i++) {
    if (this.type.split("").indexOf("W") !== -1) {
      if (wiring[i].rowCol[0] === leftRowCol[0] && wiring[i].rowCol[1] === leftRowCol[1] && flowing !== "rightward") {
        wiring[i].hasPower = true;
        wiring[i].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "leftward");
      }
    }
    if (this.type.split("").indexOf("N") !== -1) {
      if (wiring[i].rowCol[0] === topRowCol[0] && wiring[i].rowCol[1] === topRowCol[1] && flowing !== "downward") {
        wiring[i].hasPower = true;
        wiring[i].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "upward");
      }
    }
    if (this.type.split("").indexOf("E") !== -1) {
      if (wiring[i].rowCol[0] === rightRowCol[0] && wiring[i].rowCol[1] === rightRowCol[1] && flowing !== "leftward") {
        wiring[i].hasPower = true;
        wiring[i].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "rightward");
      }
    }
    if (this.type.split("").indexOf("S") !== -1) {
      if (wiring[i].rowCol[0] === bottomRowCol[0] && wiring[i].rowCol[1] === bottomRowCol[1] && flowing !== "upward") {
        wiring[i].hasPower = true;
        wiring[i].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "downward");
      }
    }
  }

  //look through force field blocks:
  for (let i = 0; i < forceFieldBlocks.length; i++) {
    if (forceFieldBlocks[i].rowCol[0] === leftRowCol[0] && forceFieldBlocks[i].rowCol[1] === leftRowCol[1]) {
      forceFieldBlocks[i].hasPower = true;
    }
    if (forceFieldBlocks[i].rowCol[0] === topRowCol[0] && forceFieldBlocks[i].rowCol[1] === topRowCol[1]) {
      forceFieldBlocks[i].hasPower = true;
    }
    if (forceFieldBlocks[i].rowCol[0] === rightRowCol[0] && forceFieldBlocks[i].rowCol[1] === rightRowCol[1]) {
      forceFieldBlocks[i].hasPower = true;
    }
    if (forceFieldBlocks[i].rowCol[0] === bottomRowCol[0] && forceFieldBlocks[i].rowCol[1] === bottomRowCol[1]) {
      forceFieldBlocks[i].hasPower = true;
    }
  }

  //look through button blocks:
  for (let i = 0; i < buttonBlocks.length; i++) {
    if (buttonBlocks[i].rowCol[0] === leftRowCol[0] && buttonBlocks[i].rowCol[1] === leftRowCol[1]) {
      buttonBlocks[i].hasPower = true;
    }
    if (buttonBlocks[i].rowCol[0] === topRowCol[0] && buttonBlocks[i].rowCol[1] === topRowCol[1]) {
      buttonBlocks[i].hasPower = true;
    }
    if (buttonBlocks[i].rowCol[0] === rightRowCol[0] && buttonBlocks[i].rowCol[1] === rightRowCol[1]) {
      buttonBlocks[i].hasPower = true;
    }
    if (buttonBlocks[i].rowCol[0] === bottomRowCol[0] && buttonBlocks[i].rowCol[1] === bottomRowCol[1]) {
      buttonBlocks[i].hasPower = true;
    }
  }
};

module.exports = PowerObject;
