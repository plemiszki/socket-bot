function Cubby(options) {
  this.id = options.id;
  this.rowCol = options.rowCol;
  this.item = options.startItem;

  this.toString = () => "cubby";
}

module.exports = Cubby;
