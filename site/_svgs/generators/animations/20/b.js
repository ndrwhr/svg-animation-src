const SVG = require('../../utils/SVG');

module.exports = () => {
  const RECT_WIDTH = 30;
  const RECT_HEIGHT = 70;
  const CIRCLE_RADIUS = RECT_WIDTH / 2;
  const OFFSET = RECT_WIDTH * 0.8;
  const DURATION = 2;

  const TIMING_OFFSET = 0.5;
  const TIMING_FUNCTION = `cubic-bezier(${TIMING_OFFSET}, 0, ${1 -
    TIMING_OFFSET}, 1)`;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `-50 -50 100 100`,
  });

  const defs = svg.defs();

  defs.rect({
    id: 'main-shape',
    x: -RECT_WIDTH / 2,
    y: -RECT_HEIGHT / 2,
    width: RECT_WIDTH,
    height: RECT_HEIGHT,
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
      animation: main-anim ${DURATION}s ${TIMING_FUNCTION} infinite alternate -${DURATION /
    2}s;
    }

    @keyframes main-anim {
      from {
        transform: translate(-${OFFSET}%, 0);
      }

      to {
        transform: translate(${OFFSET}%, 0);
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
