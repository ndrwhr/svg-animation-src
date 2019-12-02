const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { pointsToCurvedPathData } = require('../../utils/Path')

// http://www.fundza.com/algorithmic/space_filling/hilbert/basics/index.html
const hilbert = (x0, y0, xi, xj, yi, yj, n) => {
  if (n <= 0) {
    return [vec2.fromValues(x0 + (xi + yi) / 2, y0 + (xj + yj) / 2)];
  } else {
    return [
      ...hilbert(x0, y0, yi / 2, yj / 2, xi / 2, xj / 2, n - 1),
      ...hilbert(
        x0 + xi / 2,
        y0 + xj / 2,
        xi / 2,
        xj / 2,
        yi / 2,
        yj / 2,
        n - 1,
      ),
      ...hilbert(
        x0 + xi / 2 + yi / 2,
        y0 + xj / 2 + yj / 2,
        xi / 2,
        xj / 2,
        yi / 2,
        yj / 2,
        n - 1,
      ),
      ...hilbert(
        x0 + xi / 2 + yi,
        y0 + xj / 2 + yj,
        -yi / 2,
        -yj / 2,
        -xi / 2,
        -xj / 2,
        n - 1,
      ),
    ];
  }
};

module.exports = id => {
  const SIZE = 80;
  const OFFSET = (100 - SIZE) / 2;

  const input = [OFFSET, OFFSET + SIZE, 0, -SIZE, SIZE, 0];

  const iterations = 4;
  const curvature = 0.5;

  // 4 = 1275 length.
  const points = hilbert(...input, iterations);

  const segmentLength = vec2.dist(points[0], points[1]);
  const dashArray = [segmentLength, segmentLength];
  const dashArrayLength = dashArray.reduce((s, v) => s + v, 0);

  const DURATION = 1 * (dashArrayLength / segmentLength);

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `0 0 100 100`,
  });

  svg.style(`
    path {
      stroke: black;
      stroke-width: 1.5;
      fill: none;
      stroke-dasharray: ${dashArray.map(v => `${v}%`).join(',')};
      animation: main-anim ${DURATION}s linear infinite;
    }

    @keyframes main-anim {
      from {
        stroke-dashoffset: 0;
      }
      to {
        stroke-dashoffset: ${dashArrayLength}%;
      }
    }
  `);

  const d = pointsToCurvedPathData(points, curvature);
  svg.path({
    d,
  });

  return svg;
};
