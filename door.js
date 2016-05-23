function Door(id, side) {
  this.toString = function () { return "door" };
  this.id = id;
  this.status = "closed";
  this.aniFrame = undefined;
  this.side = side;
};

module.exports = Door;
