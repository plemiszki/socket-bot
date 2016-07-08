var PowerObject = require('./powerObject');

function PowerSource(options) {
  this.initializePowerObject(options);
}

var Surrogate = function () {};
Surrogate.prototype = PowerObject.prototype;
PowerSource.prototype = new Surrogate();
PowerSource.prototype.constructor = PowerSource;

module.exports = PowerSource;
