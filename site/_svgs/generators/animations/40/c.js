const range = require('lodash/range');

const SVG = require('../../utils/SVG');

const polarToCart = (theta, r) => ({
  cx: r * Math.cos(toRad(theta)),
  cy: r * Math.sin(toRad(theta)),
});

const toRad = deg => (Math.PI * deg) / 180;

module.exports = () => {
  const DURATION = 5;
  const BASE_RADIUS = 45;
  const NUM_CIRCLES = 5;

  const scaleFactor = {
    2: 2,
    3: 1 + 2 / Math.sqrt(3),
    4: 1 + Math.sqrt(2),
    5: 1 + Math.sqrt(2 * (1 + 1 / Math.sqrt(5))),
  }[NUM_CIRCLES];

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  const style = svg.style(`
    .animation-group {
      animation: main-anim ${DURATION}s linear infinite;
    }

    @keyframes main-anim {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(${360 / NUM_CIRCLES}deg);
      }
    }
  `);

  svg.circle({
    r: BASE_RADIUS,
    fill: 'black',
  });

  const recurse = (parent, white, depth) => {
    const mainGroup = parent.g({
      className: 'animation-group',
    });

    range(NUM_CIRCLES).forEach(i => {
      const angle = (i * 360) / NUM_CIRCLES;
      const r = BASE_RADIUS / scaleFactor;
      const subGroup = mainGroup.g({
        transform: `rotate(${angle}) translate(0, -${BASE_RADIUS -
          r}) scale(${1 / scaleFactor})`,
      });

      subGroup.circle({
        r: BASE_RADIUS,
        fill: white ? 'white' : 'black',
      });

      if (depth > 1) {
        recurse(subGroup, !white, depth - 1);
      }
    });
  };

  recurse(svg, true, 3);

  return svg;
};
