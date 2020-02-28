module.exports = require('./_make')({
  R: 10,
  delayFnGenerator: ({ N }) => ({ x, y, r, c }) => r / N,
});
