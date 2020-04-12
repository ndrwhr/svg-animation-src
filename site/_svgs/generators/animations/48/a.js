const Combinatorics = require('js-combinatorics');
const seedrandom = require('seedrandom');
const { shuffle, getRandom } = require('../../utils/array');

const random = seedrandom(32);

const points = [
  [-0.5, -0.5],
  [0.5, -0.5],
  [0.5, 0.5],
  [-0.5, 0.5],
];

const pointPerms = shuffle(Combinatorics.permutation(points).toArray(), random);

module.exports = require('./_make')({
  paths: pointPerms,
  pathNumber: ({ i, j, n }) =>
    Math.floor(getRandom(0, pointPerms.length, random)),
});
