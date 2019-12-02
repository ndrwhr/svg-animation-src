const range = require('lodash/range');
const { vec2 } = require('gl-matrix');

const SVG = require('../../utils/SVG');

const INNER_RADIUS = 20;
const LENGTH = 50 - INNER_RADIUS - 10;
const NUM_LINES = 100;
const DURATION = 2;

const toRad = deg => (Math.PI * deg) / 180;

const make = ({ delayFn, transformOrigin = '0 0' }) => id => {
  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  const TIMING_OFFSET = 0.5;
  const TIMING_FUNCTION = `cubic-bezier(${TIMING_OFFSET}, 0, ${1 -
    TIMING_OFFSET}, 1)`;

  svg.style(`
    line {
      stroke: black;
      stroke-width: 0.3;
      transform-origin: ${transformOrigin};
      animation: main-anim ${DURATION}s ${TIMING_FUNCTION} alternate infinite;
    }

    @keyframes main-anim {
      from {
        transform: scaleX(0.4);
      }

      to {
        transform: scaleX(1);
      }
    }
  `);

  const deltaA = 360 / NUM_LINES;
  range(NUM_LINES).forEach(i => {
    svg
      .g({
        transform: `rotate(${deltaA * i - 90}) translate(${INNER_RADIUS}, 0)`,
      })
      .line({
        x1: 0,
        y1: 0,
        x2: LENGTH,
        y2: 0,
        style: {
          animationDelay: `-${delayFn(NUM_LINES, i) * DURATION}s`,
        },
      });
  });

  return svg;
};

module.exports = make({ delayFn: (numLines, i) => 2 - (i * 2) / numLines });
module.exports.make = make;
