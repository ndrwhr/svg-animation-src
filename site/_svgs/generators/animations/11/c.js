const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { createPoints } = require('../../utils/Polygon')

module.exports = id => {
  const NUM_LINES = 19;
  const ANIMATION_DURATION = 20;
  const SIZE = 60;
  const OFFSET = (100 - SIZE) / 2;

  const points = createPoints(3, SIZE / 2);

  const svg = SVG.svg({
    dataAnimationDuration: `${ANIMATION_DURATION}s`,
    viewBox: '0 0 100 100',
  });

  svg
    .defs()
    .clipPath({
      id: 'mask',
    })
    .polygon({
      points: points.map(p => p.join(',')).join(' '),
      transform: `translate(50, 50)`,
    });

  svg.style(`
    .line-group {
      animation: move-anim ${ANIMATION_DURATION}s ease-in-out infinite;
    }

    @keyframes move-anim {
      0% {
        transform: translate(0, 0);
      }

      100% {
        transform: translate(0, ${SIZE}%);
      }
    }

    rect {
      transform-origin: 0 0;
      animation: scale-anim ${ANIMATION_DURATION}s ease-in-out infinite;
    }

    @keyframes scale-anim {
      0% {
        transform: scaleY(0.001);
      }
      50% {
        transform: scaleY(1);
      }
      100% {
        transform: scaleY(0.001);
      }
    }
  `);

  // Calculate an offset to center the triangle vertically.
  const offset = (100 - (points[1][1] - points[0][1])) / 2 - (50 - SIZE / 2);

  const g = svg.g({
    clipPath: 'url(#mask)',
    transform: `translate(0, ${offset})`,
  });

  range(NUM_LINES).forEach(index => {
    g.g({
      className: 'line-group',
      style: {
        animationDelay: `-${(index * ANIMATION_DURATION) / NUM_LINES}s`,
      },
    }).rect({
      x: 0,
      y: -2.5,
      width: 100,
      height: 5,
      style: {
        animationDelay: `-${(index * ANIMATION_DURATION) / NUM_LINES}s`,
      },
    });
  });

  return svg;
};
