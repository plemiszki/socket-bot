class Door {
  constructor(id, side, color) {
    this.id = id;
    this.status = "closed";
    this.percentOpen = 0;
    this.aniFrame = undefined;
    this.side = side;
    this.color = color || 'red';
  }

  toString() {
    return "door";
  }

  open() {
    if(this.status !== "open") {
      this.status = "opening";
    }
  }

  close() {
    if(this.status !== "closed") {
      this.status = "closing";
    }
  }
}

module.exports = Door;
