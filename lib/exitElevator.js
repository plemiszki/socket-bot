import Elevator from './elevator.js';

class ExitElevator extends Elevator {
  constructor(options) {
    super(options);
    this.exit = true;
  }
}

module.exports = ExitElevator;
