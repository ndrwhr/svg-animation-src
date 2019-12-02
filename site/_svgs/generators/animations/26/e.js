const range = require('lodash/range');

const SVG = require('../../utils/SVG');

module.exports = () => {
  const MAX_RADIUS = 45;
  const MIN_RADIS = 1.5;
  const NUM_CIRCLES = 14;
  const DURATION = 2;
  const ANGLE_OFFSET = 180;
  const radiusStepSize = (MAX_RADIUS - MIN_RADIS) / (NUM_CIRCLES - 1);

  const TIMING_OFFSET = 0.5;
  const TIMING_FUNCTION = `cubic-bezier(${TIMING_OFFSET}, 0, ${1 -
    TIMING_OFFSET}, 1)`;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `-50 -50 100 100`,
  });

  svg.style(`
    circle {
      transform-origin: 0 0;
      stroke: none;
    }

    circle.white {
      fill: white;
    }

    circle.black {
      fill: black;
    }

    .rotating-parent {
      transform-origin: 0 ${radiusStepSize}%;
      animation: main-anim ${DURATION}s ${TIMING_FUNCTION} infinite alternate;
    }

    @keyframes main-anim {
      0% {
        transform: translate(0, ${-radiusStepSize * 0.8}%);
      }
      50% {
        transform: translate(0, ${radiusStepSize * 0.8}%);
      }
      100% {
        transform: translate(0, ${-radiusStepSize * 0.8}%);
      }
    }
  `);

  range(NUM_CIRCLES)
    .reverse()
    .reduce((parent, i) => {
      const r = radiusStepSize * i + MIN_RADIS;
      const offset = MAX_RADIUS - r;

      const newParent = parent.g({
        className: 'rotating-parent',
        style: {
          animationDelay: `-${(i * DURATION) / NUM_CIRCLES}s`,
        },
      });

      newParent.circle({
        className: i % 2 === 0 ? 'black' : 'white',
        cx: 0,
        cy: 0,
        r,
      });

      return newParent;
    }, svg.g());

  return svg;
};
