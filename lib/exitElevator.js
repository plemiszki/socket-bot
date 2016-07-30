import Elevator from './elevator.js';

class ExitElevator extends Elevator {
  constructor(options) {
    super(options);
    this.exit = true;
  }
}

// var Surrogate = function () {};
// Surrogate.prototype = Elevator.prototype;
// ExitElevator.prototype = new Surrogate();
// ExitElevator.prototype.constructor = ExitElevator;

module.exports = ExitElevator;
