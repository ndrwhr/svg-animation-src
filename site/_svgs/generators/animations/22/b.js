const range = require('lodash/range')

const SVG = require('../../utils/SVG')

module.exports = id => {
  const STRIP_THICKNESS = 5;
  const RADIUS = 30;
  const DURATION = 3;

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
      id: 'right-half',
    })
    .rect({
      x: 50,
      y: 0,
      width: 50,
      height: 100,
    });

  defs
    .clipPath({
      id: 'left-half',
    })
    .rect({
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

    .stripes {
      animation: stripes-anim ${DURATION}s linear infinite;
    }

    .stripes--right {
      animation-direction: reverse;
    }

    @keyframes stripes-anim {
      from {
        transform: translate(0, 0);
      }

      to {
        transform: translate(0, ${STRIP_THICKNESS * 2}%);
      }
    }
  `);

  svg
    .g({
      clipPath: 'url(#left-half)',
    })
    .g({
      clipPath: 'url(#mask)',
    })
    .use({
      className: 'stripes stripes--left',
      href: '#stripes',
    });

  svg
    .g({
      clipPath: 'url(#right-half)',
    })
    .g({
      clipPath: 'url(#mask)',
    })
    .use({
      className: 'stripes stripes--right',
      href: '#stripes',
      transform: `translate(0, ${STRIP_THICKNESS})`,
    });

  return svg;
};
