const range = require('lodash/range');

const SVG = require('../../utils/SVG');
const { createAngles, createPoints } = require('../../utils/Polygon');

module.exports = () => {
  const RING_COUNT = 10;
  const STROKE_WIDTH = 2;
  const MAX_RADIUS = 85;
  const MIN_RADIUS = 5;
  const RADIUS_STEP = (MAX_RADIUS - MIN_RADIUS) / (RING_COUNT - 1);
  const DURATION = 1;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-100 -100 200 200',
  });

  range(RING_COUNT).forEach(index => {
    const startRadius = MAX_RADIUS - index * RADIUS_STEP;
    const endRadius = startRadius + RADIUS_STEP / 2;
    const delay = (DURATION / RING_COUNT) * index;

    svg.style(`
      .circle-${index} {
        stroke: black;
        stroke-width: 0.5;
        fill: none;
        animation: expand-${index} ${DURATION}s infinite ease-in-out alternate -${delay}s;
      }

      @keyframes expand-${index} {
        from {
          r: ${startRadius};
        }
        to {
          r: ${endRadius};
        }
      }
    `);

    svg.circle({
      className: `circle-${index}`,
      cx: 0,
      cy: 0,
      r: startRadius,
    });
  });

  return svg;
};
