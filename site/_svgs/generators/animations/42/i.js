const { make } = require('./a')

module.exports = make({
  delayFn: (numLines, i) => ((numLines - i) * 16) / numLines,
  transformOrigin: '20% 0',
});
