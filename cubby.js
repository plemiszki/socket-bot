function Cubby(options) {
  this.id = options.id;
  this.rowCol = options.rowCol;
  this.item = options.startItem;

  this.toString = function () { return "cubby" };
}

module.exports = Cubby;
