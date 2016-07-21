import PowerObject from './powerObject';

function ButtonBlock(options) {
  this.initializePowerObject(options);
  this.side = options.side;
  this.pushFunc = options.func;
  this.color = options.color || 'red';
}

var Surrogate = function () {};
Surrogate.prototype = PowerObject.prototype;
ButtonBlock.prototype = new Surrogate();
ButtonBlock.prototype.constructor = ButtonBlock;

module.exports = ButtonBlock;
