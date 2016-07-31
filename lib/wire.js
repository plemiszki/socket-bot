import PowerObject from './powerObject';

class Wire extends PowerObject {
  constructor(options) {
    super(options);
    this.type = options.type;
  }
}

module.exports = Wire;
