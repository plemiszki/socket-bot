var Door = require('./door.js')
var Elevator = require('./elevator.js')
var ButtonBlock = require('./buttonBlock.js')
var Cubby = require('./cubby.js')

function Level(name, foregroundGrid, backgroundGrid, robotPos, elevators, doors, cubbies) {
  this.name = name;
  this.foregroundGrid = foregroundGrid;
  this.backgroundGrid = backgroundGrid;
  this.startingPos = robotPos;
  this.elevators = elevators;
  this.doors = doors;
  this.cubbies = cubbies;
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
  Cubby: Cubby
};
