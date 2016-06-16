var WireSegment = require('./WireSegment.js');

function WireJunction(options) {
  this.id = options.id;
  this.rowCol = options.rowCol;
  this.segmentStrings = options.segmentStrings;
  this.segments = {};
  for (var i = 0; i < this.segmentStrings.length; i++) {
    if (this.segmentStrings[i] === "N") {
      this.segments['N'] = new WireSegment({ id: "N" });
    } else if (this.segmentStrings[i] === "E") {
      this.segments['E'] = new WireSegment({ id: "E" });
    } else if (this.segmentStrings[i] === "S") {
      this.segments['S'] = new WireSegment({ id: "S" });
    } else if (this.segmentStrings[i] === "W") {
      this.segments['W'] = new WireSegment({ id: "W" });
    }
  }
}

WireJunction.prototype.sendPower = function (wiring, buttonBlocks, forceFieldBlocks, flowing) {

  var topRowCol = [this.rowCol[0] - 1, this.rowCol[1]];
  var leftRowCol = [this.rowCol[0], this.rowCol[1] - 1];
  var rightRowCol = [this.rowCol[0], this.rowCol[1] + 1];
  var bottomRowCol = [this.rowCol[0] + 1, this.rowCol[1]];

  // //look through wires:
  // for (var i = 0; i < wiring.length; i++) {
  //   if (wiring[i].rowCol[0] === leftRowCol[0] && wiring[i].rowCol[1] === leftRowCol[1] && flowing !== "rightward") {
  //     wiring[i].hasPower = true;
  //     wiring[i].sendPower(wiring, buttonBlocks, forceFieldBlocks, "leftward");
  //   }
  //   if (wiring[i].rowCol[0] === topRowCol[0] && wiring[i].rowCol[1] === topRowCol[1] && flowing !== "downward") {
  //     wiring[i].hasPower = true;
  //     wiring[i].sendPower(wiring, buttonBlocks, forceFieldBlocks, "upward");
  //   }
  //   if (wiring[i].rowCol[0] === rightRowCol[0] && wiring[i].rowCol[1] === rightRowCol[1] && flowing !== "leftward") {
  //     wiring[i].hasPower = true;
  //     wiring[i].sendPower(wiring, buttonBlocks, forceFieldBlocks, "rightward");
  //   }
  //   if (wiring[i].rowCol[0] === bottomRowCol[0] && wiring[i].rowCol[1] === bottomRowCol[1] && flowing !== "upward") {
  //     wiring[i].hasPower = true;
  //     wiring[i].sendPower(wiring, buttonBlocks, forceFieldBlocks, "downward");
  //   }
  // }
  //
  // //look through force field blocks:
  // for (var i = 0; i < forceFieldBlocks.length; i++) {
  //   if (forceFieldBlocks[i].rowCol[0] === leftRowCol[0] && forceFieldBlocks[i].rowCol[1] === leftRowCol[1]) {
  //     forceFieldBlocks[i].hasPower = true;
  //   }
  //   if (forceFieldBlocks[i].rowCol[0] === topRowCol[0] && forceFieldBlocks[i].rowCol[1] === topRowCol[1]) {
  //     forceFieldBlocks[i].hasPower = true;
  //   }
  //   if (forceFieldBlocks[i].rowCol[0] === rightRowCol[0] && forceFieldBlocks[i].rowCol[1] === rightRowCol[1]) {
  //     forceFieldBlocks[i].hasPower = true;
  //   }
  //   if (forceFieldBlocks[i].rowCol[0] === bottomRowCol[0] && forceFieldBlocks[i].rowCol[1] === bottomRowCol[1]) {
  //     forceFieldBlocks[i].hasPower = true;
  //   }
  // }
}


module.exports = WireJunction;
