const n = 80;

module.exports = require('./_make')({
  n,
  timeOffset: i => (16 * i) / n,
});
