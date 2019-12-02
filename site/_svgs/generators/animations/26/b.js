const range = require('lodash/range');

const SVG = require('../../utils/SVG');

module.exports = () => {
  const MAX_RADIUS = 45;
  const MIN_RADIS = 3;
  const NUM_CIRCLES = 14;
  const DURATION = 2;

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
      animation: main-anim ${DURATION}s ${TIMING_FUNCTION} infinite alternate;
    }

    circle.white {
      fill: white;
    }

    circle.black {
      fill: black;
    }

    @keyframes main-anim {
      from {
        transform: rotate(-60deg);
      }
      to {
        transform: rotate(60deg);
      }
    }
  `);

  const radiusStepSize = (MAX_RADIUS - MIN_RADIS) / (NUM_CIRCLES - 1);
  const mainGroup = svg.g();
  range(NUM_CIRCLES)
    .reverse()
    .forEach(i => {
      const r = radiusStepSize * i + MIN_RADIS;
      const offset = MAX_RADIUS - r;
      mainGroup.circle({
        className: i % 2 === 0 ? 'black' : 'white',
        cx: 0,
        cy: offset,
        r,
        style: {
          animationDelay: `-${(i * DURATION * 0.33) / NUM_CIRCLES}s`,
        },
      });
    });

  return svg;
};
