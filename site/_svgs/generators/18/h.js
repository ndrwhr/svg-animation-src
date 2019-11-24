const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { sierpinskiTriangle } = require('../../utils/LSystem')

module.exports = id => {
  const points = sierpinskiTriangle({
    size: 90,
    iterations: 4,
  });

  // total length = 1481.6168212890625 (via path.getTotalLength()).
  const segmentLength = vec2.dist(points[0], points[1]);
  const dashArray = [segmentLength, segmentLength];
  const dashArrayLength = dashArray.reduce((s, v) => s + v, 0);

  const DURATION = 0.75 * (dashArrayLength / segmentLength);

  const svg = SVG.svg({
    id,
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `-50 -50 100 100`,
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
