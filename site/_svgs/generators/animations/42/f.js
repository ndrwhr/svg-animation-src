const { make } = require('./a')

module.exports = make({
  delayFn: (numLines, i) => ((numLines - i) * 6) / numLines,
  transformOrigin: '20% 0',
});
