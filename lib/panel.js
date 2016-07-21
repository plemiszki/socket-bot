import Renderer from './renderer.js';

function Panel(segments) {
  this.segments = segments || [];
  this.hasPower = false;
}

Panel.prototype.render = function (context, pos, length, power) {
  let thickness = (length / 3);
  let x = pos[0];
  let y = pos[1];
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
    case "SW":
      y += (length / 2) - (thickness / 2) + 0.5;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x += (length / 2) + (thickness / 2) + 0.5, y);
      context.lineTo(x, y += (thickness / 2) + (length / 2) - 0.5);
      context.lineTo(x -= thickness, y);
      context.lineTo(x, y -= (length / 2) - (thickness / 2) - 0.5);
      context.lineTo(x -= ((length / 2) - (thickness / 2) + 0.5), y);
      context.closePath();
      break;
    case "NE":
      x += (length / 2) - (thickness / 2) + 0.5;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, y += (thickness / 2) + (length / 2) - 0.5);
      context.lineTo(x += (length / 2) + (thickness / 2) - 0.5, y);
      context.lineTo(x, y -= thickness);
      context.lineTo(x -= (length / 2) - (thickness / 2), y);
      context.lineTo(x, y -= (length / 2) - (thickness / 2) - 0.5);
      context.closePath();
      break;
    case "ESW":
      y += (length / 2) - (thickness / 2) + 0.5;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x += length, y);
      context.lineTo(x, y += thickness);
      context.lineTo(x -= ((length / 2) - (thickness / 2)), y);
      context.lineTo(x, y += (length / 2) - (thickness / 2) - 0.5);
      context.lineTo(x -= ((length / 2) - (thickness / 2)), y);
      context.lineTo(x, y -= ((length / 2) - (thickness / 2)));
      context.lineTo(x -= ((length / 2) - (thickness / 2)), y);
      context.closePath();
      break;
    case "ENW":
      y += (length / 2) - (thickness / 2) + 0.5;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x += (length / 2) - (thickness / 2) + 0.5, y);
      context.lineTo(x, y -= (length / 2) - (thickness / 2) + 0.5);
      context.lineTo(x += thickness, y);
      context.lineTo(x, y += (length / 2) - (thickness / 2) + 0.5);
      context.lineTo(x += (length / 2) - (thickness / 2) - 0.5, y);
      context.lineTo(x, y += thickness);
      context.lineTo(x -= length, y);
      context.closePath();
      break;
  }
  context.fillStyle = '#484848';
  context.fill();
  context.strokeStyle = '#000';
  context.stroke();
};

module.exports = Panel;
