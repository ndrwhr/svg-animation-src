const SVG = require('../../utils/SVG')
const { polygonPath } = require('../../utils/Path')
const range = require('lodash/range')
const { createPoints } = require('../../utils/Polygon')

const NUM_SLICES = 60;
const HEIGHT = 60;
const WIDTH = 40;
const DURATION = 2;
const ANIM_OFFSET = WIDTH / 10;
const TIMING_OFFSET = 0.5;
const TIMING_FUNCTION = `cubic-bezier(${TIMING_OFFSET}, 0, ${1 -
  TIMING_OFFSET}, 1)`;

module.exports = id => {
  const svg = SVG.svg({
    id,
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    polygon {
      fill: white;
      stroke: black;
      stroke-width: 0.3;
    }

    .container {
      animation: main-anim ${DURATION}s ${TIMING_FUNCTION} infinite alternate;
    }

    @keyframes main-anim {
      0% {
        transform: translate(-${ANIM_OFFSET}%, -${ANIM_OFFSET / 1.5}%);
      }

      100% {
        transform: translate(${ANIM_OFFSET}%, ${ANIM_OFFSET / 1.5}%);
      }
    }
  `);

  const points = createPoints(4, WIDTH);

  range(NUM_SLICES).forEach(i => {
    const offset = HEIGHT * (1 - i / NUM_SLICES);

    svg
      .g({
        className: 'container',
        style: {
          animationDelay: `-${(DURATION * i * 4) / NUM_SLICES}s`,
        },
      })
      .polygon({
        points,
        transform: `translate(${0} ${offset - HEIGHT / 2}) scale(1 0.2)`,
      });
  });

  return svg;
};
