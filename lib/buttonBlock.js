import PowerObject from './powerObject';

class ButtonBlock extends PowerObject {
  constructor(options) {
    super(options);
    this.side = options.side;
    this.pushFunc = options.func;
    this.color = options.color || 'red';
  }
}

module.exports = ButtonBlock;
