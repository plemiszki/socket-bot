var PowerObject = require('./powerObject');

function ButtonBlock(id, side) {
  this.initializePowerObject();
  this.id = id;
  this.side = side;
  this.toString = function () { return "buttonBlock" };
}

var Surrogate = function () {};
Surrogate.prototype = PowerObject.prototype;
ButtonBlock.prototype = new Surrogate();
ButtonBlock.prototype.constructor = ButtonBlock;

module.exports = ButtonBlock;
