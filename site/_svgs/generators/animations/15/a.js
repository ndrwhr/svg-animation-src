const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { createPoints } = require('../../utils/Polygon')

module.exports = () => {
  const NUM_LINES = 3;
  const NUM_FACETS = 3;
  const OUTER_RADIUS = 40;
  const INNER_RADIUS = 10;
  const DURATION = 10;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  const innerPoints = createPoints(NUM_FACETS, INNER_RADIUS);
  const outerPoints = createPoints(NUM_FACETS, OUTER_RADIUS);

  const defs = svg.defs();
  defs
    .clipPath({
      id: 'outer-mask',
    })
    .polygon({
      points: outerPoints,
    });

  range(NUM_LINES).reduce(
    (g, i) => {
      g.line({
        className: 'radial-line',
        x1: outerPoints[0][0],
        y1: outerPoints[0][1],
        x2: outerPoints[1][0] * 0.75,
        y2: outerPoints[1][1] * 0.75,
        style: {
          animationDelay: `-${(i * DURATION) / NUM_LINES}s`,
        },
      });

      g.line({
        x1: innerPoints[0][0],
        y1: innerPoints[0][1],
        x2: outerPoints[0][0],
        y2: outerPoints[0][1],
      });

      return g;
    },
    defs.g({
      id: 'line-group',
    }),
  );

  svg.style(`
    polygon,
    line {
      fill: none;
      stroke: black;
      stroke-width: 1;
    }

    .radial-line {
      animation: line-anim ${DURATION}s linear infinite;
    }

    @keyframes line-anim {
      from {
        transform: scale(1.4);
      }
      to {
        transform: scale(0.15);
      }
    }
  `);

  range(NUM_FACETS).reduce(
    (g, i) => {
      g.use({
        href: '#line-group',
        transform: `rotate(${(i * 360) / NUM_FACETS}, 0, 0)`,
      });

      return g;
    },
    svg.g({
      clipPath: 'url(#outer-mask)',
    }),
  );

  svg.polygon({
    points: innerPoints,
    style: {
      fill: 'white',
    },
  });

  svg.polygon({
    points: outerPoints,
  });

  return svg;
};
