var Door = require('./door.js')
var Elevator = require('./elevator.js')

function Level(name, foregroundGrid, backgroundGrid, robotPos, elevators) {
  this.name = name;
  this.foregroundGrid = foregroundGrid;
  this.backgroundGrid = backgroundGrid;
  this.startingPos = robotPos;
  this.elevators = elevators;
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
  Elevator: Elevator
};
