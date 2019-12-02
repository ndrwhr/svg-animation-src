const { vec2 } = require('gl-matrix')

const { make } = require('./a')

module.exports = make({
  delayFn: (numLines, i) => 2 - (i * 2) / numLines,
  transformOrigin: '10% 0',
});
