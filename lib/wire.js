import PowerObject from './powerObject';

class Wire extends PowerObject {
  constructor(options) {
    super(options);
    this.type = options.type;
  }
}

// var Surrogate = function () {};
// Surrogate.prototype = PowerObject.prototype;
// Wire.prototype = new Surrogate();
// Wire.prototype.constructor = Wire;

module.exports = Wire;
