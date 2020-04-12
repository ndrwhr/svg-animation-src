const { attribution, make } = require('./a');

module.exports = make({
  timeOffset: (rowIndex, colIndex, gridSize) =>
    Math.max(rowIndex, colIndex) / gridSize,
});

module.exports.attribution = attribution;
