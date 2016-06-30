function Door(id, side, color) {
  this.toString = function () { return "door" };
  this.id = id;
  this.status = "closed";
  this.percentOpen = 0;
  this.aniFrame = undefined;
  this.side = side;
  this.color = color || 'red';
};

Door.prototype.open = function () {
  if(this.status !== "open") {
    this.status = "opening";
  }
};

Door.prototype.close = function () {
  if(this.status !== "closed") {
    this.status = "closing";
  }
};

module.exports = Door;
