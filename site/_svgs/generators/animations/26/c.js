const range = require('lodash/range');

const SVG = require('../../utils/SVG');

module.exports = () => {
  const MAX_RADIUS = 45;
  const MIN_RADIS = 3;
  const NUM_CIRCLES = 14;
  const DURATION = 7;
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
      from {
        transform: rotate(${-ANGLE_OFFSET}deg) translate(0, ${radiusStepSize}%);
      }
      to {
        transform: rotate(${ANGLE_OFFSET}deg) translate(0, ${radiusStepSize}%);
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
        // style: {
        //   animationDelay: `-${i * DURATION / NUM_CIRCLES}s`,
        // },
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

module.exports.attribution =
  'Based on [JA15-080](https://www.dailyminimal.com/post/107017514524/ja15-080-a-new-geometric-design-every-day) by [Pierre Voisin](https://www.designbypierre.io/) at [DAILYMINIMAL](https://www.dailyminimal.com/).';
