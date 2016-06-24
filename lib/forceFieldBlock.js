var PowerObject = require('./powerObject');

function ForceFieldBlock(options) {
  this.initializePowerObject(options);
  this.id = options.id;
  this.rowCol = options.rowCol;
  this.toString = function () { return "forceFieldBlock" };
}

var Surrogate = function () {};
Surrogate.prototype = PowerObject.prototype;
ForceFieldBlock.prototype = new Surrogate();
ForceFieldBlock.prototype.constructor = ForceFieldBlock;

module.exports = ForceFieldBlock;
