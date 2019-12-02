const { make } = require('./a');

module.exports = make({
  timeOffset: (rowIndex, colIndex, gridSize) => rowIndex / gridSize,
});
