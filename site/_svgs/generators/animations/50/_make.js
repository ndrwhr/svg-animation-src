const range = require('lodash/range');
const { vec2 } = require('gl-matrix');
const SVG = require('../../utils/SVG');

module.exports = ({ delayFnGenerator, R }) => () => {
  const N = 14;
  const PAD = 15;
  const GAP = 0.5;
  const DURATION = 1.5;

  const delayFn = delayFnGenerator({ N });

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '0 0 100 100',
  });

  svg.style(`
    rect {
      animation: main-anim ${DURATION}s infinite ease-in-out alternate;
    }

    @keyframes main-anim {
      0% {
        transform: rotate(${-R}deg);
      }
      100% {
        transform: rotate(${R}deg);
      }
    }
  `);

  const width = (100 - GAP * (N - 1) - PAD * 2) / N;
  const height = width;

  range(N).forEach(r => {
    const y = PAD + r * width + r * GAP;

    range(N).forEach(c => {
      const x = PAD + c * width + c * GAP;

      svg.rect({
        x,
        y,
        width,
        height,
        transformOrigin: '50 50',
        style: {
          animationDelay: `${-(DURATION * delayFn({ x, y, r, c }))}s`,
        },
      });
    });
  });

  return svg;
};
