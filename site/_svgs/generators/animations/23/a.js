const range = require('lodash/range');
const { vec2 } = require('gl-matrix');

const SVG = require('../../utils/SVG');
const { circlePath, squarePath } = require('../../utils/Path');

// Nested rotating circle inside of a square.

module.exports = () => {
  const NUM_STRIPS = 15;
  const CIRCLE_RADIUS = 30;
  const SQUARE_SIZE = 70;
  const DURATION = 20;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `0 0 100 100`,
  });

  const defs = svg.defs();

  const stripesGroup = defs.g({
    id: 'stripes',
  });

  const stripeThickness = SQUARE_SIZE / (NUM_STRIPS * 2 - 1);

  range(NUM_STRIPS).forEach(i => {
    const y = i * stripeThickness * 2;
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

    .circle-ref {
      transform-origin: 50% 50%;
      animation: circle-anim ${DURATION}s linear infinite;
    }

    @keyframes circle-anim {
      from {
        transform: rotate(0);
      }

      to {
        transform: rotate(180deg);
      }
    }
  `);

  svg
    .g({
      clipPath: 'url(#square-mask)',
    })
    .use({
      href: '#stripes',
    });

  svg
    .g({
      clipPath: 'url(#circle-mask)',
    })
    .g({
      transform: 'rotate(0, 50, 50)',
    })
    .use({
      className: 'circle-ref',
      href: '#stripes',
    });

  return svg;
};
