var obj = require('./levelBuilder.js');
var Level = obj.Level;
var LevelBuilder = obj.LevelBuilder;
var builder = new LevelBuilder();

var foregroundGrid = [
  builder.rowOf(24, "block"),
  ["block"].concat(builder.rowOf(6, "")).concat(["block"]).concat(builder.rowOf(6, "")).concat(["block"]).concat(builder.rowOf(8, "")).concat(["block"]),
  builder.rowOf(5, "block").concat(builder.rowOf(2, "")).concat(["block"]).concat(builder.rowOf(6, "")).concat(builder.rowOf(3, "platform")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(12, "")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
  ["block"].concat([""]).concat(builder.rowOf(3, "block")).concat(builder.rowOf(14, "")).concat(builder.rowOf(5, "block")),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(18, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(2, "")).concat(builder.rowOf(10, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(8, "block")).concat(builder.rowOf(6, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(3, "")).concat(["block"]).concat(builder.rowOf(4, "")).concat(builder.rowOf(8, "block")).concat(builder.rowOf(6, "")).concat(["block"]),
  ["block"].concat(builder.rowOf(4, "")).concat(builder.rowOf(4, "")).concat(builder.rowOf(8, "block")).concat(builder.rowOf(2, "")).concat(builder.rowOf(5, "block")),
  builder.rowOf(17, "block").concat(builder.rowOf(6, "")).concat(["block"]),
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

level1 = new Level("test", foregroundGrid, backgroundGrid);

module.exports = level1;
