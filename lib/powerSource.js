var PowerObject = require('./powerObject');

function PowerSource(options) {
  this.initializePowerObject(options);
  this.id = options.id;
  this.toString = function () { return "powerSource" };
}

var Surrogate = function () {};
Surrogate.prototype = PowerObject.prototype;
PowerSource.prototype = new Surrogate();
PowerSource.prototype.constructor = PowerSource;

module.exports = PowerSource;
