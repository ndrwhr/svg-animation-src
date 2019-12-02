const range = require('lodash/range');

const SVG = require('../../utils/SVG');

module.exports = () => {
  const STRIP_THICKNESS = 5;
  const RADIUS = 30;
  const ANGLE = 40;
  const DURATION = 2;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `0 0 100 100`,
  });

  const defs = svg.defs();

  const stripesGroup = defs.g({
    id: 'stripes',
  });
  const numStripes = Math.floor(100 / (STRIP_THICKNESS * 2));
  range(numStripes).forEach(i => {
    const y = i * STRIP_THICKNESS * 2;
    stripesGroup.rect({
      className: 'stripe',
      x: 0,
      y: y,
      width: 100,
      height: STRIP_THICKNESS,
    });
  });

  defs
    .clipPath({
      id: 'mask',
    })
    .circle({
      r: RADIUS,
      cx: 50,
      cy: 50,
    });

  defs
    .clipPath({
      id: 'right-angle',
    })
    .rect({
      className: 'rect-mask',
      x: 50,
      y: 0,
      width: 50,
      height: 100,
    });

  defs
    .clipPath({
      id: 'left-angle',
    })
    .rect({
      className: 'rect-mask',
      x: 0,
      y: 0,
      width: 50,
      height: 100,
    });

  const TIMING_OFFSET = 0.5;
  const TIMING_FUNCTION = `cubic-bezier(${TIMING_OFFSET}, 0, ${1 -
    TIMING_OFFSET}, 1)`;

  svg.style(`
    .stripe {
      fill: black;
      stroke: none;
    }

    .rect-mask {
      transform-origin: 50% 50%;
      animation: rect-anim ${DURATION}s ${TIMING_FUNCTION} infinite alternate;
    }

    @keyframes rect-anim {
      from {
        transform: rotate(${ANGLE}deg);
      }

      to {
        transform: rotate(-${ANGLE}deg);
      }
    }
  `);

  svg
    .g({
      clipPath: 'url(#left-angle)',
    })
    .g({
      clipPath: 'url(#mask)',
    })
    .use({
      href: '#stripes',
    });

  svg
    .g({
      clipPath: 'url(#right-angle)',
    })
    .g({
      clipPath: 'url(#mask)',
    })
    .use({
      href: '#stripes',
      transform: `translate(0, ${STRIP_THICKNESS})`,
    });

  // svg.circle({
  //   r: 30,
  // });

  return svg;
};
