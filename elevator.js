function Elevator(options) {
  this.id = options.id;
  this.col = options.baseRowCol[1];
  this.baseRow = options.baseRowCol[0];
  this.blocksHigh = options.startingHeight || 0;
  this.speed = options.speed || 256;
  this.heights = options.heights;

  this.topRow = this.baseRow - this.blocksHigh;
  this.height = 0;
  this.toString = function () { return "elevator" };
}

module.exports = Elevator;
