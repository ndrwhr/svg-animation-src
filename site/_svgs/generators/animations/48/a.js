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

const pointPerms = shuffle(Combinatorics.permutation(points).toArray());

Math.random = oldRandom;

module.exports = require('./_make')({
  paths: pointPerms,
  pathNumber: ({ i, j, n }) => random(0, pointPerms.length, false),
});
