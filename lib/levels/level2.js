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

var doors = [];

var elevators = [
  new Elevator({
    id: 101,
    baseRowCol: [13, 13],
    startingHeight: 0,
    heights: [0, 4, 8]
  }),
  new Elevator({
    id: 101,
    baseRowCol: [13, 14],
    startingHeight: 0,
    heights: [0, 4, 8]
  }),
  new Elevator({
    id: 102,
    baseRowCol: [13, 7],
    startingHeight: 0,
    heights: [0, 2]
  }),
  new Elevator({
    id: 103,
    baseRowCol: [17, 1],
    startingHeight: 12,
    heights: [0, 6, 12]
  }),
  new ExitElevator({
    id: 104,
    baseRowCol: [9, 17],
    startingHeight: 0,
    heights: [0]
  }),
  new ExitElevator({
    id: 104,
    baseRowCol: [9, 18],
    startingHeight: 0,
    heights: [0]
  })
];

var cubbies = [
  new Cubby({
    id: "C101",
    rowCol: [3, 12],
    startItem: new Panel(["E", "W"])
  }),
  new Cubby({
    id: "C102",
    rowCol: [7, 12],
    startItem: new Panel(["E", "W"])
  }),
  new Cubby({
    id: "C103",
    rowCol: [16, 3],
    startItem: null
  })
];

var powerSources = [
  new PowerSource({
    id: "PS101",
    rowCol: [11, 22]
  }),
  new PowerSource({
    id: "PS102",
    rowCol: [7, 9]
  }),
  new PowerSource({
    id: "PS103",
    rowCol: [8, 8]
  })
];

var wiring = [
  new Wire({ rowCol: [7, 10], type: "EW" }),
  new Wire({ rowCol: [7, 11], type: "EW" }),
  new WireJunction({ rowCol: [7, 12], segmentStrings: ["E", "W"] }),
  new Wire({ rowCol: [7, 13], type: "EW" }),
  new Wire({ rowCol: [7, 14], type: "EW" }),

  new Wire({ rowCol: [6, 9], type: "NS" }),
  new Wire({ rowCol: [5, 9], type: "NS" }),
  new Wire({ rowCol: [4, 9], type: "NS" }),
  new Wire({ rowCol: [3, 9], type: "ES" }),
  new Wire({ rowCol: [3, 10], type: "EW" }),
  new Wire({ rowCol: [3, 11], type: "EW" }),
  new WireJunction({ rowCol: [3, 12], segmentStrings: ["E", "W"] }),
  new Wire({ rowCol: [3, 13], type: "EW" }),
  new Wire({ rowCol: [3, 14], type: "EW" }),
  new Wire({ rowCol: [3, 15], type: "EW" }),
  new Wire({ rowCol: [3, 16], type: "WS" }),
  new Wire({ rowCol: [4, 16], type: "NS" }),
  new Wire({ rowCol: [5, 16], type: "NS" }),
  new Wire({ rowCol: [6, 16], type: "NS" }),

  new Wire({ rowCol: [8, 7], type: "EW" }),
  new Wire({ rowCol: [8, 6], type: "EW" }),
  new Wire({ rowCol: [8, 5], type: "EW" }),
  new Wire({ rowCol: [8, 4], type: "ES" })
];

var buttonBlocks = [];

var forceFieldBlocks = [
  new ForceFieldBlock({
    id: "FF101",
    rowCol: [7, 15]
  }),
  new ForceFieldBlock({
    id: "FF102",
    rowCol: [7, 16]
  }),
  new ForceFieldBlock({
    id: "FF103",
    rowCol: [9, 4]
  })
];

var foregroundGrid = [
  builder.rowOf(17, "block").concat(builder.rowOf(2, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(18, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(18, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(18, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(14, "")).concat(["block"]).concat(builder.rowOf(3, "")).concat(["block"]),
  ["block"].concat([""]).concat(builder.rowOf(11, "platform")).concat(builder.rowOf(2, "")).concat(["platform"]).concat(builder.rowOf(3, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(18, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(7, "")).concat(["powerBlock"]).concat([powerSources[0]]).concat(builder.rowOf(5, "")).concat([forceFieldBlocks[0]]).concat([forceFieldBlocks[1]]).concat(builder.rowOf(2, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(7, "")).concat([powerSources[2]]).concat([powerSources[1]]).concat(builder.rowOf(5, "")).concat(builder.rowOf(2, "forceField")).concat(builder.rowOf(2, "")).concat(["block"]),
  ["block"].concat([""]).concat(builder.rowOf(2, "")).concat([forceFieldBlocks[2]]).concat(builder.rowOf(3, "block")).concat(["block"]).concat(builder.rowOf(4, "platform")).concat(builder.rowOf(2, "")).concat(builder.rowOf(2, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(1, "block")),
  ["block"].concat(builder.rowOf(2, "")).concat(new Spring()).concat(["forceField"]).concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(7, "")).concat(builder.rowOf(4, "block")),
  ["block"].concat([""]).concat(builder.rowOf(5, "block")).concat(builder.rowOf(12, "")).concat(["block"]),
  ["block"].concat([""]).concat(builder.rowOf(5, "block")).concat(builder.rowOf(12, "")).concat(["block"]),
  ["block"].concat([""]).concat(builder.rowOf(5, "block")).concat([""]).concat(builder.rowOf(5, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
  ["block"].concat([""]).concat(builder.rowOf(18, "block")),
  ["block"].concat([""]).concat(builder.rowOf(18, "block")),
  ["block"].concat(builder.rowOf(4, "")).concat(builder.rowOf(15, "block")),
  ["block"].concat([""]).concat(builder.rowOf(18, "block"))
];

var backgroundGrid = [
  builder.rowOf(20, "brick"),
  builder.rowOf(20, "brick"),
  builder.rowOf(20, "brick"),
  builder.rowOf(20, "brick"),
  builder.rowOf(20, "brick"),
  builder.rowOf(20, "brick"),
  builder.rowOf(20, "brick"),
  builder.rowOf(20, "brick"),
  builder.rowOf(20, "brick"),
  builder.rowOf(20, "brick"),
  builder.rowOf(20, "brick"),
  builder.rowOf(20, "brick"),
  builder.rowOf(20, "brick"),
  builder.rowOf(20, "brick"),
  builder.rowOf(20, "brick"),
  builder.rowOf(20, "brick"),
  builder.rowOf(20, "brick"),
  builder.rowOf(20, "brick")
];

const level = new Level({
  name: "Level 2",
  color: '#4A7A36',
  foregroundGrid: foregroundGrid,
  backgroundGrid: backgroundGrid,
  startingPos: [675.5, 900.5],
  elevators: elevators,
  doors: doors,
  cubbies: cubbies,
  wiring: wiring,
  powerSources: powerSources,
  forceFieldBlocks: forceFieldBlocks,
  buttonBlocks: buttonBlocks
});

module.exports = level;
