const { vec2 } = require('gl-matrix');

module.exports = require('./_make')({
  alternate: false,
  drawAxis: true,
  angleDelta: 90,
  baseAngles: [0],
  n: 40,
  path: [vec2.fromValues(0, -15), vec2.fromValues(0, 25)],
});
