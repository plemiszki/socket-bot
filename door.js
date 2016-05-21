function Door(id, side) {
  this.id = id;
  this.status = "closed";
  this.aniFrame = undefined;
  this.toString = function () { return "door" };
  this.side = side;
};

module.exports = Door;
