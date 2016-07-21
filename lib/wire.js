import PowerObject from './powerObject';

function Wire(options) {
  this.initializePowerObject(options);
  this.type = options.type;
}

var Surrogate = function () {};
Surrogate.prototype = PowerObject.prototype;
Wire.prototype = new Surrogate();
Wire.prototype.constructor = Wire;

module.exports = Wire;
