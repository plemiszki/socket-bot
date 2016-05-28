function PowerObject() {
}

PowerObject.prototype.initializePowerObject = function () {
  this.hasPower = false;
};

PowerObject.prototype.getPowerStatus = function () {
  return (this.hasPower)
};

module.exports = PowerObject;
