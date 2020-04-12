/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 *
 * via: https://stackoverflow.com/a/6274381 Updated to accept random function.
 */
function shuffle(a, random = Math.random) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRandom(min, max, random = Math.random) {
  return Math.floor(random() * (max - min)) + min;
}

module.exports.shuffle = shuffle;
module.exports.getRandom = getRandom;
