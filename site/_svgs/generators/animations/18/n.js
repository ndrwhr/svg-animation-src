const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { rings } = require('../../utils/LSystem')

module.exports = id => {
  const points = rings({
    size: 90,
    iterations: 2,
  });

  // total length (via path.getTotalLength()).
  const segmentLength = 2 * vec2.dist(points[0], points[1]);
  const dashArray = [segmentLength, segmentLength];
  const dashArrayLength = dashArray.reduce((s, v) => s + v, 0);

  const DURATION = 0.75 * (dashArrayLength / segmentLength);

  const svg = SVG.svg({
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
