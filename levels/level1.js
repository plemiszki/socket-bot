var obj = require('./../level_builder.js');
var Level = obj.Level;
var LevelBuilder = obj.LevelBuilder;
var Door = obj.Door;
var Elevator = obj.Elevator;
var ButtonBlock = obj.ButtonBlock;
var Cubby = obj.Cubby;
var Wire = obj.Wire;
var PowerSource = obj.PowerSource;
var ForceFieldBlock = obj.ForceFieldBlock;

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

var cubbies = [
  new Cubby({
    id: "C101",
    rowCol: [1, 2]
  }),
  new Cubby({
    id: "C102",
    rowCol: [5, 8]
  }),
];

var powerSources = [
  new PowerSource({
    id: "PS101",
    rowCol: [11, 22]
  })
]

var wiring = [
  new Wire({ id: 101, rowCol: [3, 5] }),
  new Wire({ id: 102, rowCol: [3, 6] }),
  new Wire({ id: 103, rowCol: [3, 7] }),
  new Wire({ id: 104, rowCol: [4, 7] }),

  new Wire({ id: 104, rowCol: [11, 21], type: "EW" }),
  new Wire({ id: 104, rowCol: [11, 20], type: "EW" }),
  new Wire({ id: 104, rowCol: [11, 19], type: "EW" }),
  new Wire({ id: 104, rowCol: [11, 18], type: "EW" }),
  new Wire({ id: 104, rowCol: [11, 17], type: "EW" }),
  new Wire({ id: 104, rowCol: [11, 16], type: "EW" }),
  new Wire({ id: 104, rowCol: [11, 15], type: "EW" }),
  new Wire({ id: 104, rowCol: [11, 14], type: "NE" }),
  new Wire({ id: 104, rowCol: [10, 14], type: "NS" }),
  new Wire({ id: 104, rowCol: [9, 14], type: "NS" }),
  new Wire({ id: 104, rowCol: [8, 14], type: "NS" }),
  new Wire({ id: 104, rowCol: [7, 14], type: "NS" }),
  new Wire({ id: 104, rowCol: [6, 14], type: "NS" }),
  new Wire({ id: 104, rowCol: [5, 14], type: "NS" }),
  new Wire({ id: 104, rowCol: [4, 14], type: "ES" }),
  new Wire({ id: 104, rowCol: [4, 15], type: "EW" }),
  new Wire({ id: 104, rowCol: [4, 16], type: "EW" }),
  new Wire({ id: 104, rowCol: [4, 17], type: "EW" }),
  new Wire({ id: 104, rowCol: [4, 18], type: "EW" })
]

var buttonBlocks = [
  new ButtonBlock({
    id: "BB101",
    side: "left",
    rowCol: [0, 0],
    func: function () {
      doors[0].open();
    }
  }),
  new ButtonBlock({
    id: "BB102",
    side: "right",
    rowCol: [0, 0],
    func: function () {
      doors[1].open();
    }
  })
];

var forceFieldBlocks = [
  new ForceFieldBlock({
    id: "FF101",
    rowCol: [4, 19]
  })
];

var foregroundGrid = [
  builder.rowOf(24, "block"),
  ["block"].concat(builder.rowOf(2, "")).concat(doors[0]).concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(6, "")).concat([buttonBlocks[1]]).concat(builder.rowOf(4, "")).concat(doors[1]).concat(builder.rowOf(3, "")).concat(["block"]),
  builder.rowOf(5, "block").concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(6, "")).concat(builder.rowOf(3, "platform")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
  ["block"].concat(builder.rowOf(3, "")).concat([buttonBlocks[0]]).concat(builder.rowOf(12, "")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
  ["block"].concat([""]).concat(builder.rowOf(3, "block")).concat(builder.rowOf(14, "")).concat([forceFieldBlocks[0]]).concat(builder.rowOf(3, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(14, "")).concat(builder.rowOf(1, "forceField")).concat(builder.rowOf(3, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(7, "block")).concat(["platform"]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(5, "block")).concat([""]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(6, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(5, "block")).concat([""]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(6, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(4, "")).concat(builder.rowOf(4, "")).concat(builder.rowOf(5, "block")).concat([""]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
  ["block", ""].concat(builder.rowOf(3, "block")).concat(builder.rowOf(2, elevators[0])).concat(builder.rowOf(7, "block")).concat([""]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(5, "")).concat(builder.rowOf(2, "powerBlock")),
  builder.rowOf(14, "block").concat(builder.rowOf(8, "")).concat([powerSources[0]]).concat(["powerBlock"]),
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
level1 = new Level("Level 1", foregroundGrid, backgroundGrid, [550, 375.5], elevators, doors, cubbies, wiring, powerSources, forceFieldBlocks);

module.exports = level1;
