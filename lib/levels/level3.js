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
  new Door(109, "left", 'green'),
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
  new Elevator({
    id: 111,
    baseRowCol: [9, 30],
    startingHeight: 3,
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
  new Cubby({
    id: "C101",
    rowCol: [8, 3],
    startItem: new Panel(["E", "S", "W"])
  }),
  new Cubby({
    id: "C102",
    rowCol: [4, 28],
    startItem: new Panel(["E", "N", "W"])
  }),
  new Cubby({
    id: "C103",
    rowCol: [14, 3],
    startItem: new Panel(["N", "E"])
  }),
  new Cubby({
    id: "C104",
    rowCol: [14, 28],
    startItem: new Panel(["N", "S"])
  })
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
  new Wire({ rowCol: [17, 22], type: "NE" }),
  new Wire({ rowCol: [17, 23], type: "EW" }),
  new Wire({ rowCol: [17, 24], type: "EW" }),
  new Wire({ rowCol: [17, 25], type: "EW" }),
  new Wire({ rowCol: [17, 26], type: "EW" }),
  new Wire({ rowCol: [17, 27], type: "EW" }),
  new Wire({ rowCol: [17, 28], type: "NW" }),
  new Wire({ rowCol: [16, 28], type: "NS" }),
  new Wire({ rowCol: [15, 28], type: "NS" }),
  new WireJunction({ rowCol: [14, 28], segmentStrings: ["N", "S"] }),
  new Wire({ rowCol: [13, 28], type: "NS" }),
  new Wire({ rowCol: [12, 28], type: "NS" }),
  new Wire({ rowCol: [11, 28], type: "NS" }),
  new Wire({ rowCol: [10, 28], type: "NS" }),
  new Wire({ rowCol: [9, 28], type: "NS" }),
  new Wire({ rowCol: [8, 28], type: "ESW" }),
  new Wire({ rowCol: [8, 29], type: "NW" }),
  new Wire({ rowCol: [7, 29], type: "NS" }),
  new Wire({ rowCol: [6, 29], type: "NS" }),
  new Wire({ rowCol: [5, 29], type: "NS" }),
  new Wire({ rowCol: [4, 29], type: "WS" }),
  new WireJunction({ rowCol: [4, 28], segmentStrings: ["E", "W", "N"] }),
  new Wire({ rowCol: [4, 27], type: "EW" }),
  new Wire({ rowCol: [4, 26], type: "EW" }),
  new Wire({ rowCol: [4, 25], type: "EW" }),
  new Wire({ rowCol: [4, 24], type: "EW" }),
  new Wire({ rowCol: [4, 23], type: "EW" }),
  new Wire({ rowCol: [4, 22], type: "EW" }),
  new Wire({ rowCol: [4, 21], type: "EW" }),
  new Wire({ rowCol: [4, 20], type: "EW" }),
  new Wire({ rowCol: [4, 19], type: "EW" }),
  new Wire({ rowCol: [4, 18], type: "ES" }),
  new Wire({ rowCol: [5, 18], type: "NS" }),
  new Wire({ rowCol: [6, 18], type: "NS" }),
  new Wire({ rowCol: [7, 18], type: "NS" }),

  new Wire({ rowCol: [3, 28], type: "NS" }),
  new Wire({ rowCol: [2, 28], type: "NS" }),
  new Wire({ rowCol: [1, 28], type: "WS" }),
  new Wire({ rowCol: [1, 27], type: "EW" }),
  new Wire({ rowCol: [1, 26], type: "EW" }),
  new Wire({ rowCol: [1, 25], type: "EW" }),
  new Wire({ rowCol: [1, 24], type: "EW" }),
  new Wire({ rowCol: [1, 23], type: "EW" }),
  new Wire({ rowCol: [1, 22], type: "EW" }),
  new Wire({ rowCol: [1, 21], type: "EW" }),
  new Wire({ rowCol: [1, 20], type: "EW" }),
  new Wire({ rowCol: [1, 19], type: "EW" }),
  new Wire({ rowCol: [1, 18], type: "EW" }),

  new Wire({ rowCol: [16, 15], type: "NW" }),
  new Wire({ rowCol: [16, 14], type: "EW" }),
  new Wire({ rowCol: [16, 13], type: "EW" }),
  new Wire({ rowCol: [16, 12], type: "EW" }),
  new Wire({ rowCol: [16, 11], type: "EW" }),
  new Wire({ rowCol: [16, 10], type: "EW" }),
  new Wire({ rowCol: [16, 9], type: "ES" }),
  new Wire({ rowCol: [17, 9], type: "NW" }),
  new Wire({ rowCol: [17, 8], type: "EW" }),
  new Wire({ rowCol: [17, 7], type: "EW" }),
  new Wire({ rowCol: [17, 6], type: "EW" }),
  new Wire({ rowCol: [17, 5], type: "EW" }),
  new Wire({ rowCol: [17, 4], type: "NE" }),
  new Wire({ rowCol: [16, 4], type: "NS" }),
  new Wire({ rowCol: [15, 4], type: "NS" }),
  new Wire({ rowCol: [14, 4], type: "WS" }),
  new WireJunction({ rowCol: [14, 3], segmentStrings: ["N", "E"] }),
  new Wire({ rowCol: [13, 3], type: "NS" }),
  new Wire({ rowCol: [12, 3], type: "NS" }),
  new Wire({ rowCol: [11, 3], type: "NSE" }),
  new Wire({ rowCol: [10, 3], type: "NS" }),
  new Wire({ rowCol: [9, 3], type: "NS" }),
  new WireJunction({ rowCol: [8, 3], segmentStrings: ["E", "W", "S"] }),
  new Wire({ rowCol: [8, 2], type: "NE" }),
  new Wire({ rowCol: [7, 2], type: "NS" }),
  new Wire({ rowCol: [6, 2], type: "NS" }),
  new Wire({ rowCol: [5, 2], type: "NS" }),
  new Wire({ rowCol: [4, 2], type: "NS" }),
  new Wire({ rowCol: [3, 2], type: "NS" }),
  new Wire({ rowCol: [2, 2], type: "NS" }),
  new Wire({ rowCol: [1, 2], type: "ES" }),
  new Wire({ rowCol: [1, 3], type: "EW" }),
  new Wire({ rowCol: [1, 4], type: "EW" }),
  new Wire({ rowCol: [1, 5], type: "EW" }),
  new Wire({ rowCol: [1, 6], type: "EW" }),
  new Wire({ rowCol: [1, 7], type: "EW" }),
  new Wire({ rowCol: [1, 8], type: "EW" }),
  new Wire({ rowCol: [1, 9], type: "EW" }),
  new Wire({ rowCol: [1, 10], type: "EW" }),
  new Wire({ rowCol: [1, 11], type: "EW" }),
  new Wire({ rowCol: [1, 12], type: "ESW" }),
  new Wire({ rowCol: [1, 13], type: "EW" }),
  new Wire({ rowCol: [2, 12], type: "NS" }),
  new Wire({ rowCol: [3, 12], type: "NS" }),
  new Wire({ rowCol: [4, 12], type: "NE" }),
  new Wire({ rowCol: [4, 13], type: "WS" }),
  new Wire({ rowCol: [5, 13], type: "NS" }),
  new Wire({ rowCol: [6, 13], type: "NS" }),
  new Wire({ rowCol: [7, 13], type: "NS" }),
]

var openGreenDoors = function (button) {
  for (var i = 0; i < doors.length; i++) {
    if (doors[i].color == 'green') {
      doors[i].open()
    } else {
      doors[i].close()
    }
  }
}

var openRedDoors = function (button) {
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
    rowCol: [5, 12],
    color: 'green',
    func: openGreenDoors
  }),
  new ButtonBlock({
    id: "BB102",
    side: "right",
    rowCol: [8, 4],
    func: openRedDoors
  }),
  new ButtonBlock({
    id: "BB103",
    side: "right",
    rowCol: [8, 4],
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
    rowCol: [11, 4], //check
    func: openGreenDoors
  }),
  new ButtonBlock({
    id: "BB106",
    side: "left",
    rowCol: [8, 4],
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
    rowCol: [11, 27],
    func: openRedDoors
  }),
  new ButtonBlock({
    id: "BB109",
    side: "right",
    color: 'green',
    rowCol: [8, 18],
    func: openGreenDoors
  }),
  new ButtonBlock({
    id: "BB110",
    side: "left",
    color: 'green',
    rowCol: [8, 27],
    func: openGreenDoors
  }),
  new ButtonBlock({
    id: "BB111",
    side: "right",
    rowCol: [5, 18],
    func: openRedDoors
  })
];

var forceFieldBlocks = [
  new ForceFieldBlock({
    id: "FF101",
    rowCol: [1, 14]
  }),
  new ForceFieldBlock({
    id: "FF102",
    rowCol: [1, 17]
  })
];

var foregroundGrid = [
  builder.rowOf(15, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(15, "block")),
  builder.rowOf(6, "block").concat(builder.rowOf(7, "")).concat(builder.rowOf(1, "block")).concat([forceFieldBlocks[0]]).concat(builder.rowOf(2, "")).concat([forceFieldBlocks[1]]).concat(builder.rowOf(1, "block")).concat(builder.rowOf(12, "")).concat(builder.rowOf(1, "block")),
  builder.rowOf(6, "block").concat(builder.rowOf(7, "")).concat(doors[0]).concat("forceField").concat(builder.rowOf(2, "")).concat(["forceField"]).concat(doors[9]).concat(builder.rowOf(7, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(1, "block")),
  builder.rowOf(6, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(7, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(7, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(1, "block")),
  builder.rowOf(6, "block").concat(builder.rowOf(8, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(8, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(1, "block")),
  builder.rowOf(1, "block").concat(builder.rowOf(4, "")).concat([doors[1]]).concat(builder.rowOf(7, "")).concat([buttonBlocks[0]]).concat(builder.rowOf(4, "")).concat([buttonBlocks[10]]).concat(builder.rowOf(7, "")).concat([doors[8]]).concat(builder.rowOf(4, "")).concat(["block"]),
  builder.rowOf(1, "block").concat(builder.rowOf(1, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(10, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(1, "")).concat(["block"]),
  builder.rowOf(1, "block").concat(builder.rowOf(4, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(14, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(4, "")).concat(builder.rowOf(1, "block")),
  builder.rowOf(1, "block").concat(builder.rowOf(3, "")).concat([buttonBlocks[2]]).concat(builder.rowOf(3, "")).concat([doors[2]]).concat(builder.rowOf(4, "")).concat([buttonBlocks[5]]).concat(builder.rowOf(4, "")).concat([buttonBlocks[8]]).concat(builder.rowOf(4, "")).concat([doors[7]]).concat(builder.rowOf(3, "")).concat([buttonBlocks[9]]).concat(builder.rowOf(3, "")).concat(builder.rowOf(1, "block")),
  builder.rowOf(1, "block").concat(builder.rowOf(1, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(10, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(4, "block")).concat([""]).concat(["block"]),
  builder.rowOf(6, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(8, "")).concat(builder.rowOf(4, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(6, "block")),
  builder.rowOf(4, "block").concat([buttonBlocks[4]]).concat(builder.rowOf(3, "")).concat(builder.rowOf(16, "block")).concat(builder.rowOf(3, "")).concat([buttonBlocks[7]]).concat(builder.rowOf(4, "block")),
  builder.rowOf(6, "block").concat(builder.rowOf(2, "")).concat(builder.rowOf(16, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(6, "block")),
  builder.rowOf(1, "block").concat(builder.rowOf(4, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(2, "block")).concat(builder.rowOf(4, "")).concat(["block"]).concat(builder.rowOf(2, "powerBlock")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(2, "block")).concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(1, "block")),
  builder.rowOf(1, "block").concat(builder.rowOf(4, "")).concat([doors[3]]).concat(builder.rowOf(3, "")).concat([doors[4]]).concat(builder.rowOf(4, "")).concat(["block"]).concat(builder.rowOf(2, "powerBlock")).concat(["block"]).concat(builder.rowOf(4, "")).concat([doors[5]]).concat(builder.rowOf(3, "")).concat([doors[6]]).concat(builder.rowOf(3, "")).concat([new Spring()]).concat(builder.rowOf(1, "block")),
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

level = new Level({
  name: "Level 3",
  color: '#8B8D9A',
  foregroundGrid: foregroundGrid,
  backgroundGrid: backgroundGrid,
  startingPos: [1000.5, 1275.5],
  elevators: elevators,
  doors: doors,
  cubbies: cubbies,
  wiring: wiring,
  powerSources: powerSources,
  forceFieldBlocks: forceFieldBlocks,
  buttonBlocks: buttonBlocks
});

module.exports = level;
