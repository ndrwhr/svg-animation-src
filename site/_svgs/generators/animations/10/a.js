const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { createPoints } = require('../../utils/Polygon')

module.exports = id => {
  const DURATION = 2;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    line {
      stroke: black;
      stroke-width: 2;
    }

    .outer-line-group {
      animation: line-group-anim ${DURATION}s infinite linear;
    }

    @keyframes line-group-anim {
      from {
        transform: translate(0, -60%);
      }

      to {
        transform: translate(0, -56%);
      }
    }

    .base-poly {
      stroke: black;
      stroke-width: 2;
      fill: none;
    }
  `);

  const defs = svg.defs();

  const points = createPoints(6, 30);
  const deltaY = vec2.fromValues(points[0], points[1][1] - points[0][1]);

  const upperSurfacePoints = [
    points[0],
    points[1],
    vec2.create(),
    points[points.length - 1],
  ];

  defs
    .clipPath({
      id: 'upper-clip-path',
    })
    .polygon({
      points: upperSurfacePoints.map(p => p.join(',')).join(' '),
    });

  const innerLineGroup = defs.g({
    id: 'line-group',
    transform: 'skewY(30)',
  });

  range(16).forEach(index => {
    innerLineGroup.line({
      x1: 0,
      y1: index * 4,
      x2: 50,
      y2: index * 4,
    });
  });

  const clippedGroup = svg.g({
    clipPath: 'url(#upper-clip-path)',
  });

  const outerLineGroup = clippedGroup.g({
    className: 'outer-line-group',
  });

  outerLineGroup.use({
    href: '#line-group',
  });

  outerLineGroup.use({
    href: '#line-group',
    transform: 'scale(-1, 1)',
  });

  svg.polygon({
    className: 'base-poly',
    points: points.map(p => p.join(',')).join(' '),
  });

  svg.line({
    x1: points[0][0],
    y1: points[0][1],
    x2: points[3][0],
    y2: points[3][1],
  });

  svg.line({
    x1: points[1][0],
    y1: points[1][1],
    x2: 0,
    y2: 0,
  });

  svg.line({
    x1: points[5][0],
    y1: points[5][1],
    x2: 0,
    y2: 0,
  });

  return svg;
};
