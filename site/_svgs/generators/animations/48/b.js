const Combinatorics = require('js-combinatorics');
const seedrandom = require('seedrandom');
const shuffle = require('lodash/shuffle');
const random = require('lodash/random');

const oldRandom = Math.random;
Math.random = seedrandom(32);

const points = [
  [-0.5, -0.5],
  [0.5, -0.5],
  [0.5, 0.5],
  [-0.5, 0.5],
];

const pointPerms = shuffle(Combinatorics.permutation(points).toArray()).slice(
  0,
  8,
);

Math.random = oldRandom;

module.exports = require('./_make')({
  paths: pointPerms,
  pathNumber: ({ i, j, n }) => (i * n + j) % pointPerms.length,
  extraAttrs: ({ duration }) => ({
    style: {
      animationDelay: `${-random(0, duration, true)}s`,
    },
  }),
});
