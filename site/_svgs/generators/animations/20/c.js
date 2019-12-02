const SVG = require('../../utils/SVG');

module.exports = () => {
  const CIRCLE_R = 20;
  const RECT_HEIGHT = 70;
  const CIRCLE_RADIUS = CIRCLE_R / 1.2;
  const OFFSET_X = CIRCLE_R * 0.8;
  const OFFSET_Y = CIRCLE_R * 0.5;
  const DURATION = 2;

  const TIMING_OFFSET = 0.5;
  const TIMING_FUNCTION = `cubic-bezier(${TIMING_OFFSET}, 0, ${1 -
    TIMING_OFFSET}, 1)`;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `-50 -50 100 100`,
  });

  const defs = svg.defs();

  defs.circle({
    id: 'main-shape',
    r: CIRCLE_R,
  });

  defs
    .clipPath({
      id: 'mask',
    })
    .use({
      href: '#main-shape',
    });

  svg.style(`
    .pendulum-x {
      animation: main-anim-x ${DURATION}s ${TIMING_FUNCTION} infinite alternate -${DURATION /
    2}s;
    }

    @keyframes main-anim-x {
      from {
        transform: translate(-${OFFSET_X}%, 0);
      }
      to {
        transform: translate(${OFFSET_X}%, 0);
      }
    }

    .pendulum-y {
      animation: main-anim-y ${DURATION /
        0.25}s ${TIMING_FUNCTION} infinite alternate -${DURATION / 2}s;
    }

    @keyframes main-anim-y {
      from {
        transform: translate(0, -${OFFSET_Y}%);
      }
      to {
        transform: translate(0, ${OFFSET_Y}%);
      }
    }
  `);

  svg
    .g({
      className: 'pendulum-x',
    })
    .g({
      className: 'pendulum-y',
    })
    .circle({
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
    .g({
      className: 'pendulum-x',
    })
    .g({
      className: 'pendulum-y',
    })
    .circle({
      cx: 0,
      cy: 0,
      r: CIRCLE_RADIUS,
      fill: 'white',
      stroke: 'none',
    });

  return svg;
};
