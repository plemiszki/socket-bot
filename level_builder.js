var Door = require('./door.js')
var Elevator = require('./elevator.js')
var ButtonBlock = require('./buttonBlock.js')
var Cubby = require('./cubby.js')
var Wire = require('./wire.js')
var PowerSource = require('./powerSource.js')
var ForceFieldBlock = require('./forceFieldBlock.js')

function Level(name, foregroundGrid, backgroundGrid, robotPos, elevators, doors, cubbies, wiring, powerSources, forceFieldBlocks) {
  this.name = name;
  this.foregroundGrid = foregroundGrid;
  this.backgroundGrid = backgroundGrid;
  this.startingPos = robotPos;
  this.elevators = elevators;
  this.doors = doors;
  this.cubbies = cubbies;
  this.wiring = wiring;
  this.powerSources = powerSources;
  this.forceFieldBlocks = forceFieldBlocks;
}

function LevelBuilder() {};

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
  ButtonBlock: ButtonBlock,
  Cubby: Cubby,
  Wire: Wire,
  PowerSource: PowerSource,
  ForceFieldBlock: ForceFieldBlock
};
