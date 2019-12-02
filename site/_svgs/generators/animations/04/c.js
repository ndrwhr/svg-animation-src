const range = require('lodash/range')

const SVG = require('../../utils/SVG')
const { createAngles, createPoints } = require('../../utils/Polygon')

module.exports = () => {
  const RING_COUNT = 20;
  const ANIMATION_DURATION = 3;
  const STROKE_WIDTH = 2;
  const MAX_RADIUS = 85;
  const MIN_RADIUS = 2;
  const RADIUS_STEP = (MAX_RADIUS - MIN_RADIUS) / (RING_COUNT - 1);

  const svg = SVG.svg({
    dataAnimationDuration: `${ANIMATION_DURATION}s`,
    viewBox: '-100 -100 200 200',
  });

  svg.style(`
    circle {
      fill: none;
      stroke: black;
      stroke-width: 0.5;
    }

    circle:nth-child(odd) {
      animation: rotate ${ANIMATION_DURATION}s infinite linear;
    }

    @keyframes rotate {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `);

  const group = svg.g();

  range(RING_COUNT).forEach(index => {
    const startRadius = MAX_RADIUS - index * RADIUS_STEP;
    const delay = index * (ANIMATION_DURATION / RING_COUNT);

    group.circle({
      cx: 0,
      cy: index % 2 ? 0 : -RADIUS_STEP / 2,
      r: startRadius,
      style: {
        animationDelay: `-${delay}s`,
      },
    });
  });

  return svg;
};
