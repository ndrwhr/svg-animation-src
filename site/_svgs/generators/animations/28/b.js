const { attribution, make } = require('./a');

module.exports = make({
  timeOffset: (rowIndex, colIndex, gridSize) => rowIndex / gridSize,
});

module.exports.attribution = attribution;
