var Door = require('./door.js')

function Level(name, foregroundGrid, backgroundGrid, robotPos) {
  this.name = name;
  this.foregroundGrid = foregroundGrid;
  this.backgroundGrid = backgroundGrid;
  this.startingPos = robotPos;
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
  Door: Door
};
