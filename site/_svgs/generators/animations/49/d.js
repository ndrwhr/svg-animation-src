const { vec2 } = require('gl-matrix');
const range = require('lodash/range');

const ARMS = 5;
module.exports = require('./_make')({
  alternate: false,
  angleDelta: 80,
  baseAngles: range(ARMS).map(i => (i * 360) / ARMS),
  n: 20,
  path: [vec2.fromValues(0, -5), vec2.fromValues(0, 5)],
});
