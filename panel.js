var Renderer = require('./renderer.js')

function Panel(type) {
  this.type = type;
}

Panel.prototype.render = function (context, pos, length, power) {
  var x = pos[0];
  var y = pos[1];
  context.beginPath();
  context.rect(x, y, length, length);
  context.fillStyle = '#333';
  context.fill();
  context.strokeStyle = '#000';
  context.stroke();
};

module.exports = Panel;
