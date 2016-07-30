import PowerObject from './powerObject';

class PowerSource extends PowerObject {
  constructor(options) {
    super(options);
  }
}

// function PowerSource(options) {
//   this.initializePowerObject(options);
// }
//
// var Surrogate = function () {};
// Surrogate.prototype = PowerObject.prototype;
// PowerSource.prototype = new Surrogate();
// PowerSource.prototype.constructor = PowerSource;

module.exports = PowerSource;
