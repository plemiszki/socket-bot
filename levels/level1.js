var obj = require('./../level_builder.js');
var Level = obj.Level;
var LevelBuilder = obj.LevelBuilder;
var Door = obj.Door;
var Elevator = obj.Elevator;

var builder = new LevelBuilder();
var doors = [
  new Door(101, "right"),
  new Door(102, "left")
];
var elevators = [
  new Elevator({
    id: 101,
    baseRowCol: [10, 5],
    startingHeight: 4,
    heights: [4, 8]
  }),
  new Elevator({
    id: 101,
    baseRowCol: [10, 6],
    startingHeight: 4,
    heights: [4, 6]
  }),
];

var foregroundGrid = [
  builder.rowOf(24, "block"),
  ["block"].concat(builder.rowOf(2, "")).concat(doors[0]).concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(6, "")).concat(["block"]).concat(builder.rowOf(5, "")).concat(doors[1]).concat(builder.rowOf(2, "")).concat(["block"]),
  builder.rowOf(5, "block").concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(6, "")).concat(builder.rowOf(3, "platform")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(12, "")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
  ["block"].concat([""]).concat(builder.rowOf(3, "block")).concat(builder.rowOf(14, "")).concat(builder.rowOf(5, "block")),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(18, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(10, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(8, "block")).concat(builder.rowOf(6, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(8, "block")).concat(builder.rowOf(6, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(4, "")).concat(builder.rowOf(4, "")).concat(builder.rowOf(8, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
  builder.rowOf(5, "block").concat(builder.rowOf(2, elevators[0])).concat(builder.rowOf(10, "block")).concat(builder.rowOf(6, "")).concat(["block"]),
  builder.rowOf(17, "block").concat(builder.rowOf(6, "")).concat(["block"]),
  builder.rowOf(24, "block")
];

var backgroundGrid = [
  builder.rowOf(24, "brick"),
  builder.rowOf(24, "brick"),
  builder.rowOf(24, "brick"),
  builder.rowOf(24, "brick"),
  builder.rowOf(24, "brick"),
  builder.rowOf(24, "brick"),
  builder.rowOf(24, "brick"),
  builder.rowOf(24, "brick"),
  builder.rowOf(24, "brick"),
  builder.rowOf(24, "brick"),
  builder.rowOf(24, "brick"),
  builder.rowOf(24, "brick"),
  builder.rowOf(24, "brick")
];

level1 = new Level("Level 1", foregroundGrid, backgroundGrid, [938, 375.5], elevators);

module.exports = level1;
