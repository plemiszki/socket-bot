function Elevator(options) {
  this.id = options.id;
  this.col = options.baseRowCol[1];
  this.baseRow = options.baseRowCol[0];
  this.blocksHigh = options.startingHeight || 0;
  this.speed = options.speed || 400;
  this.heights = options.heights;

  this.topRow = this.baseRow - this.blocksHigh;
  this.additionalPixels = 0;
  this.toString = () => "elevator";
}

module.exports = Elevator;
