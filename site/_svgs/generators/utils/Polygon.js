const { mat2, vec2 } = require('gl-matrix');
const range = require('lodash/range');

const createPoints = (n, radius = 1, baseRotation = 0) => {
  const vector = vec2.fromValues(0, -radius);
  const lerp = (2 * Math.PI) / n;
  return createAngles(n).map(angle => {
    const angleRad = (Math.PI * (angle + baseRotation)) / 180;
    const rotationMatrix = mat2.fromRotation(mat2.create(), angleRad);
    return vec2.transformMat2(vec2.create(), vector, rotationMatrix);
  });
};

const createAngles = n => {
  const lerp = 360 / n;
  return range(n).map(index => lerp * index);
};

const getPerimeterLength = (n, radius) => {
  const angle = (2 * Math.PI) / n;
  return n * 2 * radius * Math.sin(angle / 2);
};

module.exports = {
  createPoints,
  createAngles,
  getPerimeterLength,
};
