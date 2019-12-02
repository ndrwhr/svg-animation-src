const { vec2 } = require('gl-matrix')
const range = require('lodash/range')

const SVG = require('../../utils/SVG')
const ParametricEquations = require('../../utils/ParametricEquations')

module.exports = id => {
  const DURATION = 240;
  const NUM_CIRCLES = 31;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  const endRotation = Math.PI * 2;
  const count = 1000;
  const eqs = ParametricEquations.Complex2({
    s: 20,
    k: 3,
    j: 1,
    d: 30,
    c: 30,
    b: 1,
    a: 30,
  });

  const keyframes = ParametricEquations.getKeyframes(eqs, {
    count,
    endRotation,
    maxSize: 80,
  });

  svg.style(`
    circle {
      stroke: none;
      fill: black;
      stroke-width: 0.2;
      animation: circle-anim ${DURATION}s linear infinite;
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
