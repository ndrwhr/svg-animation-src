const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { createPoints } = require('../../utils/Polygon')

module.exports = () => {
  const NUM_RINGS = 10;
  const animationDuration = 30;

  const svg = SVG.svg({
    dataAnimationDuration: `${animationDuration}s`,
    viewBox: '-50 -50 100 100',
  });

  const defs = svg.defs();
  const circleGroup = defs.g({
    id: 'circle-group',
  });
  range(NUM_RINGS).forEach(index => {
    circleGroup.circle({
      className: 'circle-group__circle',
      cx: 0,
      cy: 0,
      r: 120,
      style: { animationDelay: `-${(index * animationDuration) / NUM_RINGS}s` },
    });
  });

  defs
    .clipPath({
      id: 'mask',
    })
    .circle({
      cx: 0,
      cy: 0,
      r: 40,
    });

  svg.style(`
    circle {
      stroke: black;
      stroke-width: 2;
      fill: none;
    }

    .circle-group__circle {
      animation: moving-poly-anim ${animationDuration}s linear infinite;
    }

    @keyframes moving-poly-anim {
      from {
        r: 1;
      }

      to {
        r: 120;
      }
    }
  `);

  const mainGroup = svg.g({
    clipPath: 'url(#mask)',
  });
  range(2).forEach(index => {
    mainGroup.use({
      href: '#circle-group',
      transform: `rotate(${120 * (index + 1)}, 0, 0) translate(0, -80)`,
    });
  });

  svg.circle({
    cx: 0,
    cy: 0,
    r: 40,
  });

  return svg;
};
