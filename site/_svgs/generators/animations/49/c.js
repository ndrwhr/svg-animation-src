const { vec2 } = require('gl-matrix');

module.exports = require('./_make')({
  alternate: false,
  angleDelta: 80,
  baseAngles: [0, 120, 240],
  n: 20,
  path: [vec2.fromValues(0, -5), vec2.fromValues(0, 5)],
});
