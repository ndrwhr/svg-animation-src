const { make } = require('./a')

module.exports = make({
  timeOffset: (rowIndex, colIndex, gridSize) =>
    Math.max(rowIndex, colIndex) / gridSize,
});
