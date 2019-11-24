const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { createPoints } = require('../../utils/Polygon')

module.exports = id => {
  const NUM_LINES = 19;
  const ANIMATION_DURATION = 20;
  const SIZE = 60;
  const OFFSET = (100 - SIZE) / 2;

  const svg = SVG.svg({
    id,
    dataAnimationDuration: `${ANIMATION_DURATION}s`,
    viewBox: '0 0 100 100',
  });

  svg
    .defs()
    .clipPath({
      id: 'mask',
    })
    .circle({
      cx: 50,
      cy: 50,
      r: SIZE / 2,
    });

  svg.style(`
    .line-group {
      animation: move-anim ${ANIMATION_DURATION}s ease-in-out infinite;
    }

    @keyframes move-anim {
      0% {
        transform: translate(0, 20%);
      }

      100% {
        transform: translate(0, ${20 + SIZE}%);
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

  const g = svg.g({
    clipPath: 'url(#mask)',
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
