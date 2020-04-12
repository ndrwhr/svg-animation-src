const { vec2 } = require('gl-matrix');
const range = require('lodash/range');

const ARMS = 4;
module.exports = require('./_make')({
  alternate: true,
  angleDelta: 90,
  baseAngles: range(ARMS).map(i => (360 * i) / ARMS - 45),
  n: 30,
  path: [vec2.fromValues(0, -5), vec2.fromValues(0, 5)],
});
