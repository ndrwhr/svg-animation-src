const { vec2 } = require('gl-matrix');
const range = require('lodash/range');

const SVG = require('../../utils/SVG');
const ParametricEquations = require('../../utils/ParametricEquations');

module.exports = () => {
  const DURATION = 150;
  const NUM_CIRCLES = 7;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  const endRotation = Math.PI * 4;
  const count = 200;
  const eqs = ParametricEquations.Lissajous({
    a: 25,
    b: 25,
    kx: 3,
    ky: 4,
  });

  const keyframes = ParametricEquations.getKeyframes(eqs, {
    count,
    endRotation,
    maxSize: 70,
  });

  svg.style(`
    circle {
      fill: black;
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
