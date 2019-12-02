const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { createPoints } = require('../../utils/Polygon')

module.exports = id => {
  const DURATION = 10;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    polygon {
      stroke: none;
    }

    polygon:nth-child(odd) {
      fill: black;
      animation: poly-anim ${DURATION}s linear infinite;
    }

    polygon:nth-child(even) {
      fill: white;
    }

    polygon:nth-child(3n) {
      animation-direction: reverse;
    }

    @keyframes poly-anim {
      from {
        transform: rotate(0);
      }

      to {
        transform: rotate(360deg);
      }
    }
  `);

  const shapes = svg.g();
  const numSides = 3;

  [50, 40, 30, 20, 10].map(baseRadius => {
    const innerRadius = baseRadius * 0.93;
    shapes.polygon({
      points: createPoints(numSides, baseRadius)
        .map(point => point.join(','))
        .join(' '),
    });

    shapes.polygon({
      points: createPoints(numSides, innerRadius)
        .map(point => point.join(','))
        .join(' '),
      transform: 'rotate(60)',
    });
  });

  return svg;
};
