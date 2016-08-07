import {
  Level, LevelBuilder, Door, Elevator, ExitElevator, ButtonBlock,
  Cubby, Wire, WireJunction, PowerSource, ForceFieldBlock, Panel, Spring
} from './../level_builder.js';

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

let testLevel = new Level("test", foregroundGrid, backgroundGrid, [200, 200], [], [], [], [], [], [], []);

module.exports = testLevel;
