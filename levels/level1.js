var obj = require('./../level_builder.js');
var Level = obj.Level;
var LevelBuilder = obj.LevelBuilder;
var Door = obj.Door;
var Elevator = obj.Elevator;
var ButtonBlock = obj.ButtonBlock;

var builder = new LevelBuilder();
var doors = [
  new Door(101, "right"),
  new Door(102, "left")
];
var buttonBlocks = [
  new ButtonBlock(101, "left"),
  new ButtonBlock(102, "right")
];
var elevators = [
  new Elevator({
    id: 101,
    baseRowCol: [10, 5],
    startingHeight: 4,
    heights: [0, 4, 8]
  }),
  new Elevator({
    id: 101,
    baseRowCol: [10, 6],
    startingHeight: 4,
    heights: [0, 4, 8]
  }),
  new Elevator({
    id: 102,
    baseRowCol: [10, 1],
    startingHeight: 0,
    heights: [0, 6]
  }),
  new Elevator({
    id: 103,
    baseRowCol: [12, 17],
    startingHeight: 6,
    heights: [0, 3, 6, 10]
  }),
  new Elevator({
    id: 103,
    baseRowCol: [12, 18],
    startingHeight: 6,
    heights: [0, 3, 6, 10]
  })
];

var foregroundGrid = [
  builder.rowOf(24, "block"),
  ["block"].concat(builder.rowOf(2, "")).concat(doors[0]).concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(6, "")).concat([buttonBlocks[1]]).concat(builder.rowOf(5, "")).concat(doors[1]).concat(builder.rowOf(2, "")).concat(["block"]),
  builder.rowOf(5, "block").concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(6, "")).concat(builder.rowOf(3, "platform")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
  ["block"].concat(builder.rowOf(3, "")).concat([buttonBlocks[0]]).concat(builder.rowOf(12, "")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
  ["block"].concat([""]).concat(builder.rowOf(3, "block")).concat(builder.rowOf(14, "")).concat([buttonBlocks[0]]).concat(builder.rowOf(3, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(18, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(10, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(8, "block")).concat(builder.rowOf(6, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(8, "block")).concat(builder.rowOf(6, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(4, "")).concat(builder.rowOf(4, "")).concat(builder.rowOf(8, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
  ["block", ""].concat(builder.rowOf(3, "block")).concat(builder.rowOf(2, elevators[0])).concat(builder.rowOf(10, "block")).concat(builder.rowOf(6, "")).concat(["block"]),
  builder.rowOf(17, "block").concat(builder.rowOf(6, "")).concat(["block"]),
  builder.rowOf(17, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block"))
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

// level1 = new Level("Level 1", foregroundGrid, backgroundGrid, [938, 375.5], elevators);
level1 = new Level("Level 1", foregroundGrid, backgroundGrid, [550, 375.5], elevators);

module.exports = level1;
