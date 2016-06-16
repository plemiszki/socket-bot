var Renderer = require('./renderer.js')

function Panel(segments) {
  this.segments = segments || [];
  this.hasPower = false;
}

Panel.prototype.render = function (context, pos, length, power) {
  var thickness = (length / 3);
  var x = pos[0];
  var y = pos[1];
  context.beginPath();
  context.rect(x, y, length, length);
  context.fillStyle = '#333';
  context.fill();
  context.strokeStyle = '#000';
  context.stroke();

  switch (this.segments.join("")) {
    case "EW":
      y += (length / 2) - (thickness / 2) + 0.5;
      context.beginPath();
      context.rect(x, y, length, thickness);
      break;
    case "NS":
      x += (length / 2) - (thickness / 2) + 0.5;
      context.beginPath();
      context.rect(x, y, thickness, length);
      break;
  }
  context.fillStyle = '#484848';
  context.fill();
  context.strokeStyle = '#000';
  context.stroke();
};

module.exports = Panel;