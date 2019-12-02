const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { createPoints } = require('../../utils/Polygon')

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

module.exports = () => {
  const SIZE = 80;
  const OFFSET = (100 - SIZE) / 2;

  const input = [OFFSET, OFFSET + SIZE, 0, -SIZE, SIZE, 0];

  const points = hilbert(...input, 4);

  // 4 = 1275 length, via path.getTotalLength();
  const segmentLength = 1275;
  const dashScale = 0.03125;
  const dashArray = [segmentLength * dashScale, segmentLength * dashScale];
  const dashArrayLength = dashArray.reduce((s, v) => s + v, 0);

  const DURATION = 100 * (dashArrayLength / segmentLength);

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `0 0 100 100`,
  });

  svg.style(`
    polyline {
      stroke: black;
      stroke-width: 0.3;
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

  svg.polyline({
    points,
  });

  return svg;
};
