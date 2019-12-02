const range = require('lodash/range');
const { vec2 } = require('gl-matrix');

const { centerAndScalePoints } = require('./Points');

const getPoints = ({ x, y }, options = {}) => {
  const { count = 101, endRotation = Math.PI * 2, maxSize } = options;

  const points = range(count + 1)
    .map(i => (endRotation * i) / count)
    .map(t => vec2.fromValues(x(t), y(t)));

  return maxSize ? centerAndScalePoints(points, { maxSize }) : points;
};

module.exports.getPoints = getPoints;

module.exports.getKeyframes = (
  eqs,
  { count = 101, endRotation = Math.PI * 2, maxSize = 90 } = {},
) =>
  getPoints(eqs, { count, endRotation, maxSize })
    .map(
      ([x, y], index) =>
        `${(100 * index) / count}% { transform: translate(${x}%, ${y}%) }`,
    )
    .join('\n');

module.exports.Ellipse = ({ a, b }) => ({
  x: t => a * Math.cos(t),
  y: t => b * Math.sin(t),
});

module.exports.Lissajous = ({ a, b, kx, ky }) => ({
  x: t => a * Math.cos(kx * t),
  y: t => b * Math.sin(ky * t),
});

// https://en.wikipedia.org/wiki/Hypotrochoid
module.exports.Hypotrochoid = ({ R, r, d }) => ({
  x: t => (R - r) * Math.cos(t) + d * Math.cos(t * ((R - r) / r)),
  y: t => (R - r) * Math.sin(t) - d * Math.sin(t * ((R - r) / r)),
});

// https://en.wikipedia.org/wiki/Epicycloid
//
// If k is an integer, then the curve is closed, and has k cusps (i.e., sharp
// corners, where the curve is not differentiable).
//
// If k is a rational number, say k=p/q expressed in simplest terms, then the
// curve has p cusps.
//
// If k is an irrational number, then the curve never closes, and forms a
// dense subset of the space between the larger circle and a circle of
// radius R + 2r.
module.exports.Epicycloid = ({ R, k }) => {
  const r = R / k;
  return {
    x: t => (R + r) * Math.cos(t) - r * Math.cos(t * ((R + r) / r)),
    y: t => (R + r) * Math.sin(t) - r * Math.sin(t * ((R + r) / r)),
  };
};

// https://en.wikipedia.org/wiki/Epitrochoid
module.exports.Epitrochoid = ({ R, r, d }) => ({
  x: t => (R + r) * Math.cos(t) - d * Math.cos(t * ((R + r) / r)),
  y: t => (R + r) * Math.sin(t) - d * Math.sin(t * ((R + r) / r)),
});

module.exports.Butterfly = () => ({
  x: t =>
    Math.sin(t) *
    (Math.pow(Math.E, Math.cos(t)) -
      2 * Math.cos(4 * t) -
      Math.pow(Math.sin(t / 12), 5)),
  y: t =>
    -Math.cos(t) *
    (Math.pow(Math.E, Math.cos(t)) -
      2 * Math.cos(4 * t) -
      Math.pow(Math.sin(t / 12), 5)),
});

// https://en.wikipedia.org/wiki/Rose_(mathematics)
module.exports.Rose = ({ n, d }) => {
  const k = n / d;
  return {
    x: t => Math.cos(k * t) * Math.cos(t),
    y: t => Math.cos(k * t) * Math.sin(t),
  };
};

// https://en.wikipedia.org/wiki/Parametric_equation#Some_sophisticated_functions
module.exports.Complex1 = ({ a, b, s }) => ({
  x: t => s * ((a - b) * Math.cos(t) + b * Math.cos(t * (a / b - 1))),
  y: t => s * ((a - b) * Math.sin(t) - b * Math.sin(t * (a / b - 1))),
});

// https://en.wikipedia.org/wiki/Parametric_equation#Some_sophisticated_functions
module.exports.Complex2 = ({ a, b, c, d, j, k, s }) => ({
  x: t => s * (Math.cos(a * t) - Math.pow(Math.cos(b * t), j)),
  y: t => s * (Math.sin(c * t) - Math.pow(Math.sin(d * t), k)),
});
