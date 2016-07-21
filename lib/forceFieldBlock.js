import PowerObject from './powerObject';

function ForceFieldBlock(options) {
  this.initializePowerObject(options);
}

var Surrogate = function () {};
Surrogate.prototype = PowerObject.prototype;
ForceFieldBlock.prototype = new Surrogate();
ForceFieldBlock.prototype.constructor = ForceFieldBlock;

module.exports = ForceFieldBlock;
