const { vec2 } = require('gl-matrix')
const range = require('lodash/range')

const SVG = require('../../utils/SVG')
const ParametricEquations = require('../../utils/ParametricEquations')

module.exports = id => {
  const DURATION = 3;

  const svg = SVG.svg({
    id,
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  const endRotation = Math.PI * 26;
  const count = 2500;
  const eqs = ParametricEquations.Hypotrochoid({ d: 3, r: 13, R: 20 });

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
