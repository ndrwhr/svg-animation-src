const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { circlePath, squarePath } = require('../../utils/Path')

// Nested rotating circle inside of a square.

module.exports = () => {
  const NUM_STRIPS = 15;
  const CIRCLE_RADIUS = 30;
  const SQUARE_SIZE = 70;
  const DURATION = 5;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `0 0 100 100`,
  });

  const defs = svg.defs();

  const stripesGroup = defs.g({
    id: 'stripes',
  });

  const stripeThickness = SQUARE_SIZE / (NUM_STRIPS * 2 - 1);

  range(NUM_STRIPS + 1).forEach(i => {
    const y = (i - 1) * stripeThickness * 2;
    stripesGroup.rect({
      className: 'stripe',
      x: 0,
      y: y + (100 - SQUARE_SIZE) / 2,
      width: 100,
      height: stripeThickness,
    });
  });

  defs
    .clipPath({
      id: 'square-mask',
    })
    .path({
      fillRule: 'evenodd',
      d: [
        circlePath({
          numSides: 5,
          radius: CIRCLE_RADIUS,
          center: vec2.fromValues(50, 50),
        }),
        squarePath({
          size: SQUARE_SIZE,
          center: vec2.fromValues(50, 50),
          counterClockwise: true,
        }),
      ].join(' '),
    });

  defs
    .clipPath({
      id: 'circle-mask',
    })
    .circle({
      cx: 50,
      cy: 50,
      r: CIRCLE_RADIUS,
    });

  const TIMING_OFFSET = 0.5;
  const TIMING_FUNCTION = `cubic-bezier(${TIMING_OFFSET}, 0, ${1 -
    TIMING_OFFSET}, 1)`;

  svg.style(`
    .stripe {
      fill: black;
      stroke: none;
    }

    .square {
      animation: square-anim ${DURATION}s linear infinite;
    }

    @keyframes square-anim {
      from {
        transform: translate(0, 0);
      }

      to {
        transform: translate(0, ${stripeThickness * 2}%);
      }
    }
  `);

  svg
    .g({
      clipPath: 'url(#square-mask)',
    })
    .use({
      className: 'square',
      href: '#stripes',
    });

  svg
    .g({
      clipPath: 'url(#circle-mask)',
    })
    .use({
      href: '#stripes',
    });

  return svg;
};
