var obj = require('./../level_builder.js');
var Level = obj.Level;
var LevelBuilder = obj.LevelBuilder;
var Door = obj.Door;
var Elevator = obj.Elevator;
var ButtonBlock = obj.ButtonBlock;
var Cubby = obj.Cubby;
var Wire = obj.Wire;
var WireJunction = obj.WireJunction;
var PowerSource = obj.PowerSource;
var ForceFieldBlock = obj.ForceFieldBlock;
var Panel = obj.Panel;

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
    rowCol: [1, 2],
    startItem: new Panel(["N", "S"])
  }),
  new Cubby({
    id: "C102",
    rowCol: [11, 15],
    startItem: new Panel(["E", "W"])
  }),
  new Cubby({
    id: "C103",
    rowCol: [4, 13],
    startItem: null
  }),
  new Cubby({
    id: "C104",
    rowCol: [8, 21],
    startItem: new Panel(["S", "W"])
  })
];

var powerSources = [
  new PowerSource({
    id: "PS101",
    rowCol: [11, 22]
  })
]

var wiring = [
  //Force Field Block
  new Wire({ rowCol: [11, 21], type: "EW" }),
  new Wire({ rowCol: [11, 20], type: "EW" }),
  new Wire({ rowCol: [11, 19], type: "EW" }),
  new Wire({ rowCol: [11, 18], type: "EW" }),
  new Wire({ rowCol: [11, 17], type: "EW" }),
  new Wire({ rowCol: [11, 16], type: "EW" }),
  new WireJunction({ rowCol: [11, 15], segmentStrings: ["E", "W"] }),
  new Wire({ rowCol: [11, 14], type: "NE" }),
  new Wire({ rowCol: [10, 14], type: "NS" }),
  new Wire({ rowCol: [9, 14], type: "NS" }),
  new Wire({ rowCol: [8, 14], type: "NS" }),
  new Wire({ rowCol: [7, 14], type: "NS" }),
  new Wire({ rowCol: [6, 14], type: "NS" }),
  new Wire({ rowCol: [5, 14], type: "NSW" }),
  new Wire({ rowCol: [4, 14], type: "ES" }),
  new Wire({ rowCol: [4, 15], type: "EW" }),
  new Wire({ rowCol: [4, 16], type: "EW" }),
  new Wire({ rowCol: [4, 17], type: "EW" }),
  new Wire({ rowCol: [4, 18], type: "EW" }),

  //Branch to top button
  new Wire({ rowCol: [1, 13], type: "ES" }),
  new Wire({ rowCol: [2, 13], type: "NS" }),
  new Wire({ rowCol: [3, 13], type: "NS" }),
  new WireJunction({ rowCol: [4, 13], segmentStrings: ["N", "S", "W"] }),
  new Wire({ rowCol: [5, 13], type: "NE" }),

  //Branch to left button
  new Wire({ rowCol: [3, 5], type: "EW" }),
  new Wire({ rowCol: [3, 6], type: "EW" }),
  new Wire({ rowCol: [3, 7], type: "WS" }),
  new Wire({ rowCol: [4, 7], type: "NE" }),
  new Wire({ rowCol: [4, 8], type: "EW" }),
  new Wire({ rowCol: [4, 9], type: "EW" }),
  new Wire({ rowCol: [4, 10], type: "EW" }),
  new Wire({ rowCol: [4, 11], type: "EW" }),
  new Wire({ rowCol: [4, 12], type: "EW" }),
]

var buttonBlocks = [
  new ButtonBlock({
    id: "BB101",
    side: "left",
    rowCol: [3, 4],
    func: function () {
      doors[0].open();
    }
  }),
  new ButtonBlock({
    id: "BB102",
    side: "right",
    rowCol: [1, 14],
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
level1 = new Level("Level 1", foregroundGrid, backgroundGrid, [550, 375.5], elevators, doors, cubbies, wiring, powerSources, forceFieldBlocks, buttonBlocks);

module.exports = level1;
