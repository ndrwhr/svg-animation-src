const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { createPoints } = require('../../utils/Polygon')

module.exports = id => {
  const DURATION = 5;
  const GRID_SIZE = 10;

  const stepSize = 100 / (GRID_SIZE + 1);
  const lineWidth = stepSize * 0.04;

  const svg = SVG.svg({
    id,
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '0 0 100 100',
  });

  svg.style(`
    .shape__line {
      stroke-width: ${lineWidth};
      stroke: black;
      transform-origin: 0 0;
      animation: main-anim ${DURATION}s linear infinite;
    }

    @keyframes main-anim {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `);

  range(GRID_SIZE).reduce((g, i) => {
    range(GRID_SIZE).forEach(j => {
      const shape = g.g({
        className: 'shape',
        transform: `translate(${(j + 1) * stepSize}, ${(i + 1) * stepSize})`,
      });
      const radius = stepSize / 2;
      const delay =
        ((i * GRID_SIZE + j) * DURATION) / 3 / (GRID_SIZE * GRID_SIZE);
      shape.line({
        className: 'shape__line',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: -radius,
        style: {
          animationDelay: `-${delay}s`,
        },
      });
    });

    return g;
  }, svg.g());

  return svg;
};
