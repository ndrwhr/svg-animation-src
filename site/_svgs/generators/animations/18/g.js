const { vec2 } = require('gl-matrix');

const SVG = require('../../utils/SVG');
const { sierpinskiTriangle } = require('../../utils/LSystem');

module.exports = () => {
  const points = sierpinskiTriangle({
    size: 90,
    iterations: 4,
  });

  // total length = 455.62481689453125 (via path.getTotalLength()).
  const segmentLength = 455.62481689453125;
  const dashScale = 1 / 27;
  const dashArray = [segmentLength * dashScale, segmentLength * dashScale];
  const dashArrayLength = dashArray.reduce((s, v) => s + v, 0);

  const DURATION = 50 * (dashArrayLength / segmentLength);

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
