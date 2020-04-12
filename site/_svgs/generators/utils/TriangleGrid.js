const { vec2 } = require('gl-matrix');
const range = require('lodash/range');

const toPixels = (q, r, edgeLength) =>
  vec2.fromValues(
    edgeLength * Math.sqrt(3) * (q + r / 2),
    edgeLength * r * (3 / 2),
  );

module.exports.getPoints = ({ start, end, edgeLength }) => {
  const points = [];

  range(start, end + 1).forEach(q => {
    const innerStart = Math.max(start, -q - end);
    const innerEnd = Math.min(end, -q + end);
    range(innerStart, innerEnd + 1).forEach(r => {
      points.push(toPixels(q, r, edgeLength));
    });
  });

  return points;
};
