const n = 80;

module.exports = require('./_make')({
  n,
  timeOffset: i => (6 * i) / n,
});
