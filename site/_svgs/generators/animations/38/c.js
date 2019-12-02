const range = require('lodash/range')

const SVG = require('../../utils/SVG')

const polarToCart = (theta, r) => ({
  cx: r * Math.cos(toRad(theta)),
  cy: r * Math.sin(toRad(theta)),
});

const toRad = deg => (Math.PI * deg) / 180;

module.exports = () => {
  const DURATION = 2;
  const NUM_RINGS = 12;
  const NUM_DOTS_PER_RING = 12;
  const MAX_RADIUS = 40;
  const DOT_RADIUS = 1;
  const ROTATION = 45;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION * 2}s`,
    viewBox: '-50 -50 100 100',
  });

  const style = svg.style(`
    circle {
      fill: black;
      stroke: none;
      animation: main ${DURATION}s ease-in-out infinite alternate;
    }

    @keyframes main {
      0% {
        transform: rotate(-${ROTATION}deg);
        r: 1;
      }

      50% {
        r: 2;
      }

      100% {
        transform: rotate(${ROTATION}deg);
        r: 1;
      }
    }
  `);

  range(NUM_RINGS).forEach(rIndex => {
    const ringRadius = (rIndex * MAX_RADIUS) / (NUM_DOTS_PER_RING - 1);
    const animationDelay = `-${(rIndex * DURATION) / NUM_RINGS}s`;

    const circumference = 2 * Math.PI * ringRadius;
    const numDots = Math.floor(circumference / (2 * DOT_RADIUS) / 4);

    if (numDots < 3) return;

    range(numDots).forEach(i => {
      const theta = (i * 360) / numDots;
      const { cx, cy } = polarToCart(theta, ringRadius);
      svg.circle({
        cx,
        cy,
        r: DOT_RADIUS,
        style: {
          animationDelay,
        },
      });
    });
  });

  return svg;
};
