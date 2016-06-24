function Door(id, side) {
  this.toString = function () { return "door" };
  this.id = id;
  this.status = "closed";
  this.percentOpen = 0;
  this.aniFrame = undefined;
  this.side = side;
};

Door.prototype.open = function () {
  if(this.status !== "open") {
    this.status = "opening";
  }
};

module.exports = Door;
