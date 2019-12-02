const SVG = require('../../utils/SVG');
const ParametricEquations = require('../../utils/ParametricEquations');

const make = (roseOptions, endRotation) => () => {
  const DURATION = 3;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  const count = 2500;
  const eqs = ParametricEquations.Rose(roseOptions);

  const dashArray = [4, 4, 1, 1];
  const dashArrayLength = dashArray.reduce((s, v) => s + v, 0);

  svg.style(`
    polyline {
      stroke: black;
      stroke-width: 0.1;
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

  const points = ParametricEquations.getPoints(eqs, {
    count,
    endRotation,
    maxSize: 90,
  });

  svg.polyline({
    points,
  });

  return svg;
};

module.exports = make({ n: 1, d: 4 }, Math.PI * 8);
module.exports.make = make;
