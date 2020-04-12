const { make } = require('./a');

module.exports = () =>
  make([
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ]);
