const { vec2 } = require('gl-matrix');
const range = require('lodash/range');

const ARMS = 3;
module.exports = require('./_make')({
  alternate: true,
  angleDelta: 60,
  baseAngles: range(ARMS).map(i => (360 * i) / ARMS),
  n: 30,
  path: [vec2.fromValues(0, -5), vec2.fromValues(0, 5)],
});
