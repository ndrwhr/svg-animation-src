const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')

module.exports = () => {
  const DURATION = 2;
  const NUM_LINES = 20;
  const WIDTH = 70;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    line {
      stroke: black;
      stroke-width: 0.3;
      animation: main-anim ${DURATION / 2}s ease-in-out infinite alternate;
    }

    @keyframes main-anim {
      from {
        transform: scaleY(12.5);
      }
      to {
        transform: scaleY(35);
      }
    }
  `);

  range(NUM_LINES).forEach(i => {
    const delay = (NUM_LINES - 1 - i) * (DURATION / NUM_LINES);
    const x = i * (WIDTH / NUM_LINES) - WIDTH / 2;
    svg
      .g({
        transform: `translate(${x}, 0)`,
      })
      .line({
        x1: 0,
        y1: 0.5,
        x2: 0,
        y2: -0.5,
        style: {
          animationDelay: `-${delay}s`,
        },
      });
  });

  return svg;
};
