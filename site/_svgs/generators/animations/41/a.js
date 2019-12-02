const range = require('lodash/range');
const { vec2 } = require('gl-matrix');

const SVG = require('../../utils/SVG');
const { getPoints } = require('../../utils/TriangleGrid');

const DURATION = 3;

const toRad = deg => (Math.PI * deg) / 180;

const make = (id, getDelayFn) => {
  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    circle {
      stroke: none;
      fill: black;
      animation: main-anim ${DURATION}s ease-in-out alternate infinite;
    }

    @keyframes main-anim {
      from {
        transform: scale(0.3);
      }

      to {
        transform: scale(1);
      }
    }
  `);

  let points = getPoints({
    start: -17,
    end: 17,
    edgeLength: 3,
  });

  const r = vec2.dist(points[0], points[1]) / 2;
  const MAX_R = r * 17;

  // Too lazy to figure out how to generate a hex grid within a square shape
  // so just loop over each point and make sure they lie within a square that
  // is of size 2 * MAX_R.
  points = points.filter(p => {
    return Math.abs(p[0]) < MAX_R && Math.abs(p[1]) < MAX_R;
  });

  const delayFn = getDelayFn(points);

  points.forEach(([cx, cy]) => {
    svg
      .g({
        transform: `translate(${cx}, ${cy})`,
      })
      .circle({
        cx: 0,
        cy: 0,
        r,
        style: {
          animationDelay: `${-1 * delayFn([cx, cy]) * DURATION}s`,
        },
      });
  });

  return svg;
};

module.exports = id => {
  return make(id, points => ([cx, cy]) => 0);
};
module.exports.make = make;
