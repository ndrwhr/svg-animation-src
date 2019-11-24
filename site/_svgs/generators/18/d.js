const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { gosper } = require('../../utils/LSystem')

module.exports = id => {
  const points = gosper({
    iterations: 3,
    size: 90,
  });

  // total length = 1485.2305908203125 (via path.getTotalLength()).
  const segmentLength = 1485.2305908203125;
  const dashScale = 1 / 49;
  const dashArray = [segmentLength * dashScale, segmentLength * dashScale];
  const dashArrayLength = dashArray.reduce((s, v) => s + v, 0);

  const DURATION = 130 * (dashArrayLength / segmentLength);

  const svg = SVG.svg({
    id,
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `-50 -50 100 100`,
  });

  svg.style(`
    polyline {
      stroke: black;
      stroke-width: 0.3;
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
    transform: 'rotate(60 0 0)',
    points,
  });

  return svg;
};
