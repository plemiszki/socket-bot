function Elevator(baseRowCol, id, startingHeight) {
  this.toString = function () { return "elevator" };
  this.id = id;
  this.col = baseRowCol[1];
  this.baseRow = baseRowCol[0];
  this.blockHeight = startingHeight;
  this.topRow = this.baseRow - this.blockHeight;
  this.height = 0;
}

module.exports = Elevator;
