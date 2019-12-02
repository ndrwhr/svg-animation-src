const range = require('lodash/range');
const { vec2 } = require('gl-matrix');

const { make } = require('./a');

module.exports = () => {
  return make(points => {
    const maxL = points.reduce((max, p) => Math.max(vec2.length(p), max), 0);

    return p => {
      const l = vec2.length(p);
      return 1 - l / maxL;
    };
  });
};
