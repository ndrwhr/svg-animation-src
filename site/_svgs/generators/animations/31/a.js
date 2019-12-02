const { vec2 } = require('gl-matrix')
const range = require('lodash/range')

const SVG = require('../../utils/SVG')
const ParametricEquations = require('../../utils/ParametricEquations')

module.exports = id => {
  const DURATION = 3;
  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  const endRotation = Math.PI * 2;
  const count = 5000;
  const eqs = ParametricEquations.Complex2({
    a: 80,
    b: 1,
    c: 80,
    d: 1,
    j: 3,
    k: 3,
    s: 20,
  });

  const dashArray = [4, 4, 1, 1];
  const dashArrayLength = dashArray.reduce((s, v) => s + v, 0);

  svg.style(`
    polyline {
      stroke: black;
      stroke-width: 0.1;
      fill: none;
      stroke-dasharray: ${dashArray.map(v => `${v}%`).join(',')};
      animation: main-anim ${DURATION}s linear infinite;
    }

    @keyframes main-anim {
      from {
        stroke-dashoffset: 0;
      }
      to {
        stroke-dashoffset: ${dashArrayLength}%;
      }
    }
  `);

  svg.polyline({
    points: ParametricEquations.getPoints(eqs, {
      count,
      endRotation,
      maxSize: 90,
    }),
  });

  return svg;
};
