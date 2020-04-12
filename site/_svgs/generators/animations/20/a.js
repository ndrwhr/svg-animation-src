const { vec2 } = require('gl-matrix');
const range = require('lodash/range');

const SVG = require('../../utils/SVG');
const { createPoints } = require('../../utils/Polygon');

module.exports = () => {
  const RADIUS = 30;
  const CIRCLE_RADIUS = Math.sin(Math.PI / 6) * RADIUS;
  const ROTATION_ANGLE = 50;
  const DURATION = 2;
  const TIMING_OFFSET = 0.5;
  const TIMING_FUNCTION = `cubic-bezier(${TIMING_OFFSET}, 0, ${1 -
    TIMING_OFFSET}, 1)`;

  const points = createPoints(3, RADIUS);

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `-50 -50 100 100`,
  });

  const defs = svg.defs();

  defs.polygon({
    id: 'main-shape',
    points,
  });

  defs
    .clipPath({
      id: 'mask',
    })
    .use({
      href: '#main-shape',
    });

  svg.style(`
    .pendulum {
      transform-origin: ${points[0][0]}% ${points[0][1]}%;
      animation: main-anim ${DURATION}s ${TIMING_FUNCTION} infinite alternate -${DURATION /
    2}s;
    }

    @keyframes main-anim {
      from {
        transform: rotate(-${ROTATION_ANGLE}deg);
      }

      to {
        transform: rotate(${ROTATION_ANGLE}deg);
      }
    }
  `);

  svg.circle({
    className: 'pendulum',
    cx: 0,
    cy: 0,
    r: CIRCLE_RADIUS,
    fill: 'black',
    stroke: 'none',
  });

  svg.use({
    href: '#main-shape',
  });

  svg
    .g({
      clipPath: 'url(#mask)',
    })
    .circle({
      className: 'pendulum',
      cx: 0,
      cy: 0,
      r: CIRCLE_RADIUS,
      fill: 'white',
      stroke: 'none',
    });

  return svg;
};

module.exports.attribution =
  'Based on [JA15-078](https://www.dailyminimal.com/post/106805544049/ja15-078-a-new-geometric-design-every-day) by [Pierre Voisin](https://www.designbypierre.io/) at [DAILYMINIMAL](https://www.dailyminimal.com/).';
