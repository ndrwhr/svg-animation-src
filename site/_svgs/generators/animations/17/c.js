const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { createPoints } = require('../../utils/Polygon')

module.exports = () => {
  const strokeWidth = 5;
  const RADIUS = 40;
  const DURATION = 2;
  const NUM_LINES = 5;
  const STEP = (RADIUS - strokeWidth) / NUM_LINES;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `-50 -50 100 100`,
  });

  const clipPath = svg.defs().clipPath({
    id: 'clip-path',
  });

  clipPath.rect({
    x: -(RADIUS + strokeWidth),
    y: -(RADIUS + strokeWidth),
    width: RADIUS + strokeWidth,
    height: RADIUS + strokeWidth,
  });

  clipPath.rect({
    x: -(RADIUS + strokeWidth),
    y: -(RADIUS + strokeWidth),
    width: RADIUS + strokeWidth,
    height: RADIUS + strokeWidth,
    transform: 'rotate(120 0 0)',
  });

  clipPath.rect({
    x: -(RADIUS + strokeWidth),
    y: -(RADIUS + strokeWidth),
    width: RADIUS + strokeWidth,
    height: RADIUS + strokeWidth,
    transform: 'rotate(-120 0 0)',
  });

  svg.style(`
    circle {
      stroke: black;
      stroke-width: ${strokeWidth};
      fill: none;
      animation: main-anim ${DURATION}s ease-in-out infinite alternate;
    }

    .center-dot {
      fill: black;
    }

    @keyframes main-anim {
      from {
        transform: rotate(-30deg);
      }
      to {
        transform: rotate(30deg);
      }
    }
  `);

  const mainGroup = svg.g({
    id: 'main-group',
    transform: `rotate(45 0 0)`,
  });

  range(NUM_LINES).forEach(i => {
    const r = 40 - i * STEP;
    mainGroup.circle({
      r: r,
      clipPath: 'url(#clip-path)',
      style: {
        animationDelay: `-${(i * DURATION) / 2 / NUM_LINES}s`,
      },
    });
  });

  mainGroup.circle({
    className: 'center-dot',
    clipPath: 'url(#clip-path)',
    r: strokeWidth,
    style: {
      animationDelay: `-${DURATION / 2}s`,
    },
  });

  return svg;
};
