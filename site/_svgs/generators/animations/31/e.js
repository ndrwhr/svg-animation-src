const { vec2 } = require('gl-matrix');
const range = require('lodash/range');

const SVG = require('../../utils/SVG');
const ParametricEquations = require('../../utils/ParametricEquations');

module.exports = () => {
  const DURATION = 3;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  const endRotation = Math.PI * 2;
  const count = 2000;
  const eqs = ParametricEquations.Complex2({
    s: 20,
    k: 4,
    j: 2,
    d: 1,
    c: 1,
    b: 80,
    a: 1,
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

  const points = ParametricEquations.getPoints(eqs, {
    count,
    endRotation,
    maxSize: 90,
  });

  svg.polyline({
    points,
  });

  return svg;
};
