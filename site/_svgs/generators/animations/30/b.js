const { vec2 } = require('gl-matrix')
const range = require('lodash/range')

const SVG = require('../../utils/SVG')
const ParametricEquations = require('../../utils/ParametricEquations')

module.exports = id => {
  const DURATION = 240;
  const NUM_CIRCLES = 17;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  const endRotation = Math.PI * 40;
  const count = 250;
  const eqs = ParametricEquations.Complex1({
    a: 6.5,
    b: 10,
    s: 2,
  });

  const keyframes = ParametricEquations.getKeyframes(eqs, {
    count,
    endRotation,
    maxSize: 90,
  });

  svg.style(`
    circle {
      stroke: none;
      fill: black;
      stroke-width: 0.2;
      animation: circle-anim ${DURATION / 4}s linear infinite;
    }

    @keyframes circle-anim {
      ${keyframes}
    }
  `);

  // svg.polyline({
  //   stroke: 'red',
  //   strokeWidth: 0.3,
  //   fill: 'none',
  //   points: ParametricEquations.getPoints(eqs, {
  //     count,
  //     endRotation,
  //   }),
  // });

  range(NUM_CIRCLES).forEach(index => {
    svg.circle({
      r: 1,
      style: {
        animationDelay: `-${(DURATION * index) / NUM_CIRCLES}s`,
      },
    });
  });

  return svg;
};
