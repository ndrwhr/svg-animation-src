const range = require('lodash/range');
const { vec2 } = require('gl-matrix');

const SVG = require('../../utils/SVG');

module.exports = () => {
  const DURATION = 2;
  const SIZE = 70;
  const NUM_COLS = 10;
  const NUM_PER_COL = 8;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION * 2}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    circle {
      stroke: black;
      stroke-width: 0.2;
      fill: white;
      animation: main-anim ${DURATION}s ease-in-out infinite alternate;
    }

    @keyframes main-anim {
      0% {
        transform: translate(0, -${SIZE / 4}%);
      }
      100% {
        transform: translate(0, ${SIZE / 4}%);
      }
    }
  `);

  range(NUM_COLS).forEach(i => {
    const x = (i * SIZE) / (NUM_COLS - 1) - SIZE / 2;

    const g = svg.g({
      transform: `translate(${x}, 0)`,
    });

    const baseDelay = (NUM_COLS - 1 - i) * (DURATION / NUM_COLS);

    range(NUM_PER_COL).forEach(j => {
      const delay = (j * DURATION * 0.3) / NUM_PER_COL;
      g.circle({
        r: 0.75,
        style: {
          animationDelay: `-${baseDelay + delay}s`,
        },
      });
    });
  });

  return svg;
};
