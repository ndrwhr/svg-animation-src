const { make } = require('./a');

module.exports = make({
  delayFn: (numLines, i) => 2 - (i * 2) / numLines,
  transformOrigin: '20% 0',
});
