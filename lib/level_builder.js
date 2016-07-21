import Door from './door.js';
import Elevator from './elevator.js';
import ExitElevator from './exitElevator.js';
import ButtonBlock from './buttonBlock.js';
import Cubby from './cubby.js';
import Wire from './wire.js';
import WireJunction from './wireJunction.js';
import PowerSource from './powerSource.js';
import ForceFieldBlock from './forceFieldBlock.js';
import Panel from './panel.js';
import Spring from './spring.js';
import Message from './message.js';

function Level(options) {
  this.name = options.name;
  this.color = options.color;
  this.foregroundGrid = options.foregroundGrid;
  this.backgroundGrid = options.backgroundGrid;
  this.startingPos = options.startingPos;
  this.elevators = options.elevators;
  this.doors = options.doors;
  this.cubbies = options.cubbies;
  this.wiring = options.wiring;
  this.powerSources = options.powerSources;
  this.forceFieldBlocks = options.forceFieldBlocks;
  this.buttonBlocks = options.buttonBlocks;
  this.messages = options.messages;
}

function LevelBuilder() {}

LevelBuilder.prototype.rowOf = function (rowLength, something) {
  let rowArray = [];
  for (let i = 0; i < rowLength; i++) {
    rowArray.push(something);
  }
  return rowArray;
};

module.exports = {
  Level: Level,
  LevelBuilder: LevelBuilder,
  Door: Door,
  Elevator: Elevator,
  ExitElevator: ExitElevator,
  ButtonBlock: ButtonBlock,
  Cubby: Cubby,
  Wire: Wire,
  WireJunction: WireJunction,
  PowerSource: PowerSource,
  ForceFieldBlock: ForceFieldBlock,
  Panel: Panel,
  Spring: Spring,
  Message: Message
};
