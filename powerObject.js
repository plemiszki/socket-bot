function PowerObject() {
}

PowerObject.prototype.initializePowerObject = function (options) {
  this.hasPower = false;
  if (options) {
    this.rowCol = options.rowCol;
  } else {
    debugger
  }
};

PowerObject.prototype.getPowerStatus = function () {
  return (this.hasPower)
};

module.exports = PowerObject;
