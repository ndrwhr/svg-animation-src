const { vec2 } = require('gl-matrix');
const range = require('lodash/range');

const SVG = require('../../utils/SVG');

module.exports = () => {
  const RADIUS = 25;
  const OFFSET = 10;
  const DURATION = 3;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `-50 -50 100 100`,
  });

  const defs = svg.defs();

  defs
    .clipPath({
      id: 'mask',
    })
    .circle({
      r: RADIUS,
    });

  svg.style(`
    .main-circle {
      stroke: black;
      stroke-width: 2;
      fill: none;
    }

    path {
      fill: black;
      transform-origin: left center;
      animation: main-anim ${DURATION}s linear infinite;
    }

    @keyframes main-anim {
      from {
        transform: translate(${RADIUS}%, 0);
      }

      to {
        transform: translate(-${RADIUS}%, 0);
      }
    }
  `);

  svg
    .g({
      clipPath: 'url(#mask)',
    })
    .g({
      transform: `translate(0 ${OFFSET})`,
    })
    .path({
      d: 'M -50 0 Q -37.5 -3 -25 0 T 0 0 T 25 0 T 50 0 V 50 H -50 V 0 ',
    });

  svg
    .g({
      clipPath: 'url(#mask)',
    })
    .g({
      transform: `rotate(180) translate(0 ${OFFSET})`,
    })
    .path({
      d: 'M -50 0 Q -37.5 -3 -25 0 T 0 0 T 25 0 T 50 0 V 50 H -50 V 0 ',
      style: {
        animationDirection: 'reverse',
        animationDelay: `-${DURATION / 2}s`,
      },
    });

  svg.circle({
    className: 'main-circle',
    cx: 0,
    cy: 0,
    r: RADIUS,
  });

  return svg;
};
