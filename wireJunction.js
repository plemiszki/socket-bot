var WireSegment = require('./wireSegment.js');

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

WireJunction.prototype.sendPower = function (wiring, cubbies, buttonBlocks, forceFieldBlocks, flowing) {
  var cubby;
  for (var i = 0; i < cubbies.length; i++) {
    if (cubbies[i].rowCol[0] === this.rowCol[0] && cubbies[i].rowCol[1] === this.rowCol[1]) {
      cubby = cubbies[i];
      break;
    }
  }

  if (flowing === "leftward" && this.segments['E']) {
    this.segments['E'].hasPower = true;
    this.giveItemPower(cubby.item, 'E');
  } else if (flowing === "rightward" && this.segments['W']) {
    this.segments['W'].hasPower = true;
    this.giveItemPower(cubby.item, 'W');
  } else if (flowing === "upward" && this.segments['S']) {
    // console.log("upward");
    // debugger
    this.giveItemPower(cubby.item, 'S');
    this.segments['S'].hasPower = true;
  } else if (flowing === "downward" && this.segments['N']) {
    this.giveItemPower(cubby.item, 'N');
    this.segments['N'].hasPower = true;
  }

  if (cubby.item) {
    if (cubby.item.hasPower) {
      for (var i = 0; i < cubby.item.segments.length; i++) {
        if (this.segments[cubby.item.segments[i]]) {
          this.segments[cubby.item.segments[i]].hasPower = true;
        }
      }
      this.sendPowerFromItem(cubby.item, wiring, cubbies, buttonBlocks, forceFieldBlocks, flowing);
    }
  }
}

WireJunction.prototype.giveItemPower = function (item, side) {
  if (item && item.segments.indexOf(side) !== -1) {
    item.hasPower = true;
  }
};

WireJunction.prototype.sendPowerFromItem = function (item, wiring, cubbies, buttonBlocks, forceFieldBlocks, flowing) {

  var topRowCol = [this.rowCol[0] - 1, this.rowCol[1]];
  var leftRowCol = [this.rowCol[0], this.rowCol[1] - 1];
  var rightRowCol = [this.rowCol[0], this.rowCol[1] + 1];
  var bottomRowCol = [this.rowCol[0] + 1, this.rowCol[1]];

  //look through wires:
  for (var i = 0; i < wiring.length; i++) {
    if (item.segments.indexOf("W") !== -1 && this.segments["W"] && wiring[i].rowCol[0] === leftRowCol[0] && wiring[i].rowCol[1] === leftRowCol[1] && flowing !== "rightward") {
      wiring[i].hasPower = true;
      wiring[i].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "leftward");
    }
    if (item.segments.indexOf("N") !== -1 && this.segments["N"] && wiring[i].rowCol[0] === topRowCol[0] && wiring[i].rowCol[1] === topRowCol[1] && flowing !== "downward") {
      wiring[i].hasPower = true;
      wiring[i].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "upward");
    }
    if (item.segments.indexOf("E") !== -1 && this.segments["E"] && wiring[i].rowCol[0] === rightRowCol[0] && wiring[i].rowCol[1] === rightRowCol[1] && flowing !== "leftward") {
      wiring[i].hasPower = true;
      wiring[i].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "rightward");
    }
    if (item.segments.indexOf("S") !== -1 && this.segments["S"] && wiring[i].rowCol[0] === bottomRowCol[0] && wiring[i].rowCol[1] === bottomRowCol[1] && flowing !== "upward") {
      wiring[i].hasPower = true;
      wiring[i].sendPower(wiring, cubbies, buttonBlocks, forceFieldBlocks, "downward");
    }
  }

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
};

module.exports = WireJunction;
