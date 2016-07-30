import PowerObject from './powerObject';

class ForceFieldBlock extends PowerObject {
  constructor(options) {
    super(options);
  }
}

// function ForceFieldBlock(options) {
//   this.initializePowerObject(options);
// }
//
// var Surrogate = function () {};
// Surrogate.prototype = PowerObject.prototype;
// ForceFieldBlock.prototype = new Surrogate();
// ForceFieldBlock.prototype.constructor = ForceFieldBlock;

module.exports = ForceFieldBlock;
