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

var doors = [
  new Door(101, "right", 'green'),
  new Door(102, "right"),
  new Door(103, "right"),
  new Door(104, "right"),
  new Door(105, "right", 'green'),
  new Door(106, "left"),
  new Door(107, "left", 'green'),
  new Door(108, "right", 'green'),
  new Door(109, "left"),
  new Door(110, "left")
];

var elevators = [
  new Elevator({
    id: 102,
    baseRowCol: [9, 9],
    startingHeight: 0,
    heights: [0, 3]
  }),
  new Elevator({
    id: 102,
    baseRowCol: [9, 10],
    startingHeight: 0,
    heights: [0, 3]
  }),
  new Elevator({
    id: 103,
    baseRowCol: [6, 6],
    startingHeight: 0,
    heights: [0, 3]
  }),
  new Elevator({
    id: 103,
    baseRowCol: [6, 7],
    startingHeight: 0,
    heights: [0, 3]
  }),
  new Elevator({
    id: 104,
    baseRowCol: [15, 6],
    startingHeight: 0,
    heights: [0, 3, 6]
  }),
  new Elevator({
    id: 104,
    baseRowCol: [15, 7],
    startingHeight: 0,
    heights: [0, 3, 6]
  }),
  new Elevator({
    id: 105,
    baseRowCol: [9, 1],
    startingHeight: 3,
    heights: [0, 3]
  }),
  new Elevator({
    id: 106,
    baseRowCol: [18, 11],
    startingHeight: 0,
    heights: [0, 3]
  }),
  new Elevator({
    id: 106,
    baseRowCol: [18, 12],
    startingHeight: 0,
    heights: [0, 3]
  }),
  new Elevator({
    id: 107,
    baseRowCol: [18, 19],
    startingHeight: 0,
    heights: [0, 3]
  }),
  new Elevator({
    id: 107,
    baseRowCol: [18, 20],
    startingHeight: 0,
    heights: [0, 3]
  }),
  new Elevator({
    id: 108,
    baseRowCol: [15, 24],
    startingHeight: 0,
    heights: [0, 3, 6]
  }),
  new Elevator({
    id: 108,
    baseRowCol: [15, 25],
    startingHeight: 0,
    heights: [0, 3, 6]
  }),
  new Elevator({
    id: 109,
    baseRowCol: [9, 21],
    startingHeight: 0,
    heights: [0, 3]
  }),
  new Elevator({
    id: 109,
    baseRowCol: [9, 22],
    startingHeight: 0,
    heights: [0, 3]
  }),
  new Elevator({
    id: 110,
    baseRowCol: [6, 24],
    startingHeight: 0,
    heights: [0, 3]
  }),
  new Elevator({
    id: 110,
    baseRowCol: [6, 25],
    startingHeight: 0,
    heights: [0, 3]
  }),
  new ExitElevator({
    id: 101,
    baseRowCol: [3, 15],
    startingHeight: 0,
    heights: [0, 3, 6, 10]
  }),
  new ExitElevator({
    id: 101,
    baseRowCol: [3, 16],
    startingHeight: 0,
    heights: [0]
  })
];

var cubbies = [
  // new Cubby({
  //   id: "C101",
  //   rowCol: [1, 2],
  //   startItem: new Panel(["N", "S"])
  // }),
  // new Cubby({
  //   id: "C102",
  //   rowCol: [11, 15],
  //   startItem: new Panel(["E", "W"])
  // }),
  // new Cubby({
  //   id: "C103",
  //   rowCol: [4, 13],
  //   startItem: new Panel(["N", "S"])
  // }),
  // new Cubby({
  //   id: "C104",
  //   rowCol: [8, 21],
  //   startItem: new Panel(["S", "W"])
  // })
];

var powerSources = [
  new PowerSource({
    id: "PS101",
    rowCol: [15, 16]
  }),
  new PowerSource({
    id: "PS102",
    rowCol: [15, 15]
  })
]

var wiring = [
  new Wire({ rowCol: [16, 16], type: "NE" }),
  new Wire({ rowCol: [16, 17], type: "EW" }),
  new Wire({ rowCol: [16, 18], type: "EW" }),
  new Wire({ rowCol: [16, 19], type: "EW" }),
  new Wire({ rowCol: [16, 20], type: "EW" }),
  new Wire({ rowCol: [16, 21], type: "EW" }),
  new Wire({ rowCol: [16, 22], type: "WS" }),

  new Wire({ rowCol: [16, 15], type: "NW" }),
  new Wire({ rowCol: [16, 14], type: "EW" }),
  new Wire({ rowCol: [16, 13], type: "EW" }),
  new Wire({ rowCol: [16, 12], type: "EW" }),
  new Wire({ rowCol: [16, 11], type: "EW" }),
  new Wire({ rowCol: [16, 10], type: "EW" }),
  new Wire({ rowCol: [16, 9], type: "ES" })
]

var openGreenDoors = function () {
  for (var i = 0; i < doors.length; i++) {
    if (doors[i].color == 'green') {
      doors[i].open()
    } else {
      doors[i].close()
    }
  }
}

var openRedDoors = function () {
  for (var i = 0; i < doors.length; i++) {
    if (doors[i].color == 'red') {
      doors[i].open()
    } else {
      doors[i].close()
    }
  }
}

var buttonBlocks = [
  new ButtonBlock({
    id: "BB101",
    side: "left",
    rowCol: [3, 8],
    color: 'green',
    func: openGreenDoors
  }),
  new ButtonBlock({
    id: "BB102",
    side: "right",
    rowCol: [1, 18],
    func: openRedDoors
  }),
  new ButtonBlock({
    id: "BB103",
    side: "right",
    rowCol: [1, 18],
    func: openRedDoors
  }),
  new ButtonBlock({
    id: "BB104",
    side: "right",
    color: 'green',
    rowCol: [17, 9],
    func: openGreenDoors
  }),
  new ButtonBlock({
    id: "BB105",
    side: "right",
    color: 'green',
    rowCol: [1, 18],
    func: openGreenDoors
  }),
  new ButtonBlock({
    id: "BB106",
    side: "left",
    rowCol: [1, 18],
    func: openRedDoors
  }),

  new ButtonBlock({
    id: "BB107",
    side: "left",
    rowCol: [17, 22],
    func: openRedDoors
  }),
  new ButtonBlock({
    id: "BB108",
    side: "left",
    rowCol: [1, 18],
    func: openRedDoors
  }),
  new ButtonBlock({
    id: "BB109",
    side: "right",
    color: 'green',
    rowCol: [1, 18],
    func: openGreenDoors
  }),
  new ButtonBlock({
    id: "BB110",
    side: "left",
    color: 'green',
    rowCol: [1, 18],
    func: openGreenDoors
  }),
  new ButtonBlock({
    id: "BB111",
    side: "right",
    rowCol: [1, 18],
    func: openRedDoors
  })
];

var forceFieldBlocks = [
  new ForceFieldBlock({
    id: "FF101",
    rowCol: [4, 23]
  }),
  new ForceFieldBlock({
    id: "FF101",
    rowCol: [4, 23]
  })
];

var foregroundGrid = [
  builder.rowOf(15, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(15, "block")),
  builder.rowOf(6, "block").concat(builder.rowOf(7, "")).concat(builder.rowOf(1, "block")).concat([forceFieldBlocks[0]]).concat(builder.rowOf(2, "")).concat([forceFieldBlocks[1]]).concat(builder.rowOf(1, "block")).concat(builder.rowOf(7, "")).concat(builder.rowOf(6, "block")),
  builder.rowOf(6, "block").concat(builder.rowOf(7, "")).concat(doors[0]).concat(builder.rowOf(4, "")).concat(doors[9]).concat(builder.rowOf(7, "")).concat(builder.rowOf(6, "block")),
  builder.rowOf(6, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(7, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(7, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(6, "block")),
  builder.rowOf(6, "block").concat(builder.rowOf(8, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(8, "")).concat(builder.rowOf(6, "block")),
  builder.rowOf(1, "block").concat(builder.rowOf(4, "")).concat([doors[1]]).concat(builder.rowOf(7, "")).concat([buttonBlocks[0]]).concat(builder.rowOf(4, "")).concat([buttonBlocks[10]]).concat(builder.rowOf(7, "")).concat([doors[8]]).concat(builder.rowOf(4, "")).concat(["block"]),
  builder.rowOf(1, "block").concat(builder.rowOf(1, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(10, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(1, "")).concat(["block"]),
  builder.rowOf(1, "block").concat(builder.rowOf(4, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(14, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(4, "")).concat(builder.rowOf(1, "block")),
  builder.rowOf(1, "block").concat(builder.rowOf(3, "")).concat([buttonBlocks[2]]).concat(builder.rowOf(3, "")).concat([doors[2]]).concat(builder.rowOf(4, "")).concat([buttonBlocks[5]]).concat(builder.rowOf(4, "")).concat([buttonBlocks[8]]).concat(builder.rowOf(4, "")).concat([doors[7]]).concat(builder.rowOf(3, "")).concat([buttonBlocks[9]]).concat(builder.rowOf(3, "")).concat(builder.rowOf(1, "block")),
  builder.rowOf(1, "block").concat(builder.rowOf(1, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(10, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(4, "block")).concat([""]).concat(["block"]),
  builder.rowOf(6, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(8, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(6, "block")),
  builder.rowOf(4, "block").concat([buttonBlocks[4]]).concat(builder.rowOf(22, "")).concat([buttonBlocks[7]]).concat(builder.rowOf(4, "block")),
  builder.rowOf(6, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(16, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(6, "block")),
  builder.rowOf(1, "block").concat(builder.rowOf(4, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(2, "block")).concat(builder.rowOf(4, "")).concat(["block"]).concat(builder.rowOf(2, "powerBlock")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(2, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(1, "block")),
  builder.rowOf(1, "block").concat(builder.rowOf(4, "")).concat([doors[3]]).concat(builder.rowOf(3, "")).concat([doors[4]]).concat(builder.rowOf(4, "")).concat(["block"]).concat(builder.rowOf(2, "powerBlock")).concat(["block"]).concat(builder.rowOf(4, "")).concat([doors[5]]).concat(builder.rowOf(3, "")).concat([doors[6]]).concat(builder.rowOf(4, "")).concat(builder.rowOf(1, "block")),
  builder.rowOf(6, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(3, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(2, "block")).concat([powerSources[0]]).concat([powerSources[0]]).concat(builder.rowOf(2, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(3, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(6, "block")),
  builder.rowOf(9, "block").concat(builder.rowOf(14, "")).concat(builder.rowOf(9, "block")),
  builder.rowOf(9, "block").concat(buttonBlocks[3]).concat(builder.rowOf(12, "")).concat(buttonBlocks[6]).concat(builder.rowOf(9, "block")),
  builder.rowOf(11, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(6, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(11, "block")),
  builder.rowOf(32, "block"),
  builder.rowOf(32, "block"),
  builder.rowOf(32, "block")
];

var backgroundGrid = [
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick"),
  builder.rowOf(32, "brick")
];

level1 = new Level("Level 2", foregroundGrid, backgroundGrid, [1000.5, 1275.5], elevators, doors, cubbies, wiring, powerSources, forceFieldBlocks, buttonBlocks);

module.exports = level1;
