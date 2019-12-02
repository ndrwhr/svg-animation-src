const range = require('lodash/range');
const { vec2, mat2 } = require('gl-matrix');

const { centerAndScalePoints } = require('./Points');

const getCurvePoints = (module.exports.getCurvePoints = ({
  size,
  start,
  rules,
  angle,
  iterations,
}) => {
  const angleRad = (Math.PI * angle) / 180;
  const LEFT_ROT_MATRIX = mat2.fromRotation(mat2.create(), -angleRad);
  const RIGHT_ROT_MATRIX = mat2.fromRotation(mat2.create(), angleRad);

  const rotatePoint = (p0, p1, matrix) => {
    const diff = vec2.subtract(vec2.create(), p1, p0);
    const newP1 = vec2.transformMat2(vec2.create(), diff, matrix);
    return vec2.add(vec2.create(), p0, newP1);
  };

  const rotations = {
    '-': (p0, p1) => rotatePoint(p0, p1, LEFT_ROT_MATRIX),
    '+': (p0, p1) => rotatePoint(p0, p1, RIGHT_ROT_MATRIX),
  };

  // Generate the recursive form of the pattern.
  const pattern = range(iterations).reduce(p => {
    return p
      .split('')
      .map(c => (rules[c] ? rules[c] : c))
      .join('');
  }, start);

  const stepLength = 10;
  let previous = vec2.create();
  let current = vec2.fromValues(stepLength, 0);

  const points = pattern.split('').reduce(
    (acc, rule) => {
      if (rules[rule]) {
        acc.push(current);

        const diff = vec2.subtract(vec2.create(), current, previous);
        previous = current;
        current = vec2.add(vec2.create(), current, diff);
      } else {
        current = rotations[rule](previous, current);
      }

      return acc;
    },
    [previous],
  );

  return centerAndScalePoints(points, {
    maxSize: size,
  });
});

module.exports.gosper = ({ iterations, size }) =>
  getCurvePoints({
    start: 'A',
    rules: {
      A: 'A-B--B+A++AA+B-',
      B: '+A-BB--B-A++A+B',
    },
    angle: 60,
    iterations,
    size,
  });

module.exports.sierpinskiTriangle = ({ iterations, size }) =>
  getCurvePoints({
    start: 'A',
    rules: {
      A: 'B+A+B',
      B: 'A-B-A',
    },
    angle: 60,
    iterations,
    size,
  });

module.exports.sierpinskiSquare = ({ iterations, size }) =>
  getCurvePoints({
    start: 'L--F--L--F',
    rules: {
      L: '+R-F-R+',
      R: '-L+F+L-',
      F: 'F',
    },
    angle: 45,
    iterations,
    size,
  });

module.exports.rings = ({ iterations, size }) =>
  getCurvePoints({
    start: 'F+F+F+F',
    rules: {
      F: 'FF+F+F+F+F+F-F',
    },
    angle: 90,
    iterations,
    size,
  });
