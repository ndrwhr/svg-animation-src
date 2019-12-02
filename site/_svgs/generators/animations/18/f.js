const range = require('lodash/range')
const { vec2, mat2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { gosper } = require('../../utils/LSystem')
const { pointsToCurvedPathData } = require('../../utils/Path')

module.exports = id => {
  const points = gosper({
    iterations: 3,
    size: 90,
  });

  const segmentLength = vec2.dist(points[0], points[1]);
  const dashArray = [segmentLength, segmentLength];
  const dashArrayLength = dashArray.reduce((s, v) => s + v, 0);

  const DURATION = 1 * (dashArrayLength / segmentLength);

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `-50 -50 100 100`,
  });

  svg.style(`
    path {
      stroke: black;
      stroke-width: 1.5;
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

  svg.path({
    transform: 'rotate(60 0 0)',
    d: pointsToCurvedPathData(points, 0.5),
  });

  return svg;
};
