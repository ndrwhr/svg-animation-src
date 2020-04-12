const { vec2 } = require('gl-matrix');

const SVG = require('../../utils/SVG');
const { rings } = require('../../utils/LSystem');
const { pointsToCurvedPathData } = require('../../utils/Path');

module.exports = () => {
  const points = rings({
    size: 90,
    iterations: 2,
  });

  // total length (via path.getTotalLength()).
  const segmentLength = vec2.dist(points[0], points[1]);
  const dashArray = [segmentLength, segmentLength * 2];
  const dashArrayLength = dashArray.reduce((s, v) => s + v, 0);

  const DURATION = 1 * (dashArrayLength / segmentLength);

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `-50 -50 100 100`,
  });

  svg.style(`
    path {
      stroke: black;
      stroke-width: 2.5;
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

  svg.path({
    d: pointsToCurvedPathData(points, 0.5, true),
  });

  return svg;
};
