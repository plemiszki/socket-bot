function PowerObject() {
}

PowerObject.prototype.initializePowerObject = function (options) {
  this.hasPower = false;
  if (options) {
    this.rowCol = options.rowCol;
  }
};

PowerObject.prototype.getPowerStatus = function () {
  return (this.hasPower)
};

module.exports = PowerObject;
