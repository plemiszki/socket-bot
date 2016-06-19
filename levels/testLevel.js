var obj = require('./../level_builder.js');
var Level = obj.Level;
var LevelBuilder = obj.LevelBuilder;
var Door = obj.Door;
var Elevator = obj.Elevator;
var ExitElevator = obj.ExitElevator;
var ButtonBlock = obj.ButtonBlock;
var Cubby = obj.Cubby;
var Wire = obj.Wire;
var WireJunction = obj.WireJunction;
var PowerSource = obj.PowerSource;
var ForceFieldBlock = obj.ForceFieldBlock;
var Panel = obj.Panel;
var Spring = obj.Spring;

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

testLevel = new Level("test", foregroundGrid, backgroundGrid, [200, 200], [], [], [], [], [], [], []);

module.exports = testLevel;
