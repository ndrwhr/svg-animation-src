const range = require('lodash/range');
const flattenDeep = require('lodash/flattenDeep');
const { vec2 } = require('gl-matrix');

const SVG = require('../../utils/SVG');
const { createPoints } = require('../../utils/Polygon');

const make = (dashArray = [[1, 1]], duration = 3) => () => {
  const NUM_POINTS = 3;
  const NUM_LINES = NUM_POINTS * 10;
  const RADIUS = 40;

  const dashArrayLength = flattenDeep(dashArray).reduce((s, v) => s + v, 0);

  const DURATION = duration;

  const points = createPoints(NUM_POINTS, RADIUS);
  const segmentLength = vec2.distance(points[0], points[1]);

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    line {
      stroke: black;
      stroke-width: 0.2;
      stroke-linecap: round;
      stroke-dasharray: ${dashArray
        .map(pair => pair.map(value => `${value * segmentLength}`).join(' '))
        .join(',')};
      animation: main-animation ${DURATION}s linear infinite;
    }

    @keyframes main-animation {
      from {
        stroke-dashoffset: ${segmentLength * dashArrayLength};
      }

      to {
        stroke-dashoffset: 0;
      }
    }
  `);

  range(NUM_LINES).forEach(i => {
    svg.line({
      x1: points[0][0],
      y1: points[0][1],
      x2: points[1][0],
      y2: points[1][1],
      transform: `rotate(${(i * 360) / NUM_LINES}, 0, 0)`,
      style: {
        animationDelay: `-${(i * DURATION) / NUM_LINES}s`,
      },
    });
  });

  return svg;
};

module.exports = make();
module.exports.make = make;
