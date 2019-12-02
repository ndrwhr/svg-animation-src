const SVG = require('../../utils/SVG')
const range = require('lodash/range')

const NUM_SLICES = 50;
const CENTER_RADIUS = 30;
const DURATION = 2;
const ANIM_OFFSET = CENTER_RADIUS / 8;
const TIMING_OFFSET = 0.7;
const TIMING_FUNCTION = `cubic-bezier(${TIMING_OFFSET}, 0, ${1 -
  TIMING_OFFSET}, 1)`;

module.exports = () => {
  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    circle {
      fill: white;
      stroke: black;
      stroke-width: 0.2;
    }

    .container {
      animation: main-anim ${DURATION}s ${TIMING_FUNCTION} infinite alternate;
    }

    @keyframes main-anim {
      0% {
        transform: translate(-${ANIM_OFFSET}%, -${ANIM_OFFSET / 2}%);
      }

      100% {
        transform: translate(${ANIM_OFFSET}%, ${ANIM_OFFSET / 2}%);
      }
    }
  `);

  const mainGroup = svg.g({
    transform: 'rotate(0)',
  });
  range(NUM_SLICES).forEach(i => {
    const offset = CENTER_RADIUS * 2 * (1 - i / NUM_SLICES);

    mainGroup
      .g({
        className: 'container',
        style: {
          animationDelay: `-${(DURATION * i * 4) / NUM_SLICES}s`,
        },
      })
      .circle({
        cx: 0,
        cy: 0,
        r: CENTER_RADIUS,
        transform: `translate(${0} ${offset -
          (CENTER_RADIUS * 2) / 2}) scale(1 0.3)`,
      });
  });

  return svg;
};
