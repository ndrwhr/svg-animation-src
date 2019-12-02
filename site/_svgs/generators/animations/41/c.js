const seedrandom = require('seedrandom');

const { make } = require('./a');

const rng = seedrandom('41-c');

module.exports = () => {
  return make(() => p => {
    return rng() * 2;
  });
};
