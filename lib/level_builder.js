var Door = require('./door.js');
var Elevator = require('./elevator.js');
var ExitElevator = require('./exitElevator.js');
var ButtonBlock = require('./buttonBlock.js');
var Cubby = require('./cubby.js');
var Wire = require('./wire.js');
var WireJunction = require('./wireJunction.js');
var PowerSource = require('./powerSource.js');
var ForceFieldBlock = require('./forceFieldBlock.js');
var Panel = require('./panel.js');
var Spring = require('./spring.js');
var Message = require('./message.js');

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
  var rowArray = [];
  for (var i = 0; i < rowLength; i++) {
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
