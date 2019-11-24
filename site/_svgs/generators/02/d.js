const range = require('lodash/range')

const SVG = require('../../utils/SVG')
const { createPoints, getPerimiterLength } = require('../../utils/Polygon')

const toRad = deg => (Math.PI * deg) / 180;

const getScale = (numSides, angle) => {
  const polygonAngle = 90 * (1 - 2 / numSides);
  const otherAngle = 180 - polygonAngle - angle;
  const scale = Math.sin(toRad(polygonAngle)) / Math.sin(toRad(otherAngle));
  return scale;
};

module.exports = id => {
  const DURATION = 2;
  const NUM_SIDES = 3;
  const NUM_NESTED = 15;
  const BASE_RADIUS = 40;
  const ANGLE = 6;

  const svg = SVG.svg({
    id,
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  const style = svg.style(`
    polygon {
      stroke: black;
      stroke-width: 0.2;
      fill: none;
      animation: ${DURATION}s linear infinite;
    }
  `);

  const mainGroup = svg.g({
    transform: `translate(0, 10)`,
  });

  let currentScale = 1;
  let currentAngle = 0;
  const data = range(NUM_NESTED).map(i => {
    const radius = BASE_RADIUS * currentScale;
    const length = getPerimiterLength(NUM_SIDES, radius);
    const n = i + 1;

    const multiple = 6 * 1;
    const dashArray = [length / multiple, length / multiple];
    const dashArrayLength = dashArray.reduce((s, v) => s + v, 0);

    style.addStyles(`
      polygon:nth-child(${n}) {
        stroke-dasharray: ${dashArray.map(v => `${v}%`).join(',')};
        animation-name: anim-${n};
      }

      @keyframes anim-${n} {
        from {
          stroke-dashoffset: 0;
        }
        to {
          stroke-dashoffset: -${dashArrayLength}%;
        }
      }
    `);

    mainGroup.polygon({
      points: createPoints(NUM_SIDES, radius, currentAngle),
    });

    currentAngle = ANGLE * n;
    currentScale *= getScale(NUM_SIDES, ANGLE);
  });

  return svg;
};
