const { attribution, make } = require('./a');

module.exports = make({
  timeOffset: (rowIndex, colIndex, gridSize) => colIndex / gridSize,
});

module.exports.attribution = attribution;
