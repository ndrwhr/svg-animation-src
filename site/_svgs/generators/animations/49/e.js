const { vec2 } = require('gl-matrix');

module.exports = require('./_make')({
  alternate: true,
  angleDelta: 90,
  baseAngles: [90, -90],
  n: 30,
  path: [vec2.fromValues(0, -5), vec2.fromValues(0, 5)],
});
