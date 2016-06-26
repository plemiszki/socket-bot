var PowerObject = require('./powerObject');

function ButtonBlock(options) {
  this.initializePowerObject(options);
  this.id = options.id;
  this.side = options.side;
  this.rowCol = options.rowCol;
  this.pushFunc = options.func;
  this.color = options.color || 'red';
  this.toString = function () { return "buttonBlock" };
}

var Surrogate = function () {};
Surrogate.prototype = PowerObject.prototype;
ButtonBlock.prototype = new Surrogate();
ButtonBlock.prototype.constructor = ButtonBlock;

module.exports = ButtonBlock;
