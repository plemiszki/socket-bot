var obj = require('./Level.js');
var Level = obj.Level;
var LevelBuilder = obj.LevelBuilder;
var builder = new LevelBuilder();

var foregroundGrid = [
  builder.rowOf(12, "block"),
  ["block", "", "", "", "", "", "", ""],
  ["block", "", "", "", "", "", "", ""],
  ["block", "", "", "block", "block", "block", "block", ""],
  ["block", "", "", "", "", "", "", ""],
  ["block"],
  builder.rowOf(12, "block")
];

var backgroundGrid = [
  builder.rowOf(12, "brick"),
  builder.rowOf(12, "brick"),
  builder.rowOf(12, "brick"),
  builder.rowOf(12, "brick"),
  builder.rowOf(12, "brick"),
  builder.rowOf(12, "brick"),
  builder.rowOf(12, "brick")
];

testLevel = new Level("test", foregroundGrid, backgroundGrid);

module.exports = testLevel;
