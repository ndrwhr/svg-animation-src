const range = require('lodash/range')

const SVG = require('../../utils/SVG')

const polarToCart = (theta, r) => ({
  cx: r * Math.cos(toRad(theta)),
  cy: r * Math.sin(toRad(theta)),
});

const toRad = deg => (Math.PI * deg) / 180;

module.exports = () => {
  const DURATION = 1;
  const NUM_RINGS = 10;
  const MIN_RADIUS = 5;
  const MAX_RADIUS = 40;
  const DOT_RADIUS = 1;
  const ROTATION = 45;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION * 2}s`,
    viewBox: '-50 -50 100 100',
  });

  const style = svg.style(`
    line {
      stroke-width: 0.2;
      stroke: black;
      animation: main ${DURATION}s ease-in-out infinite alternate -${DURATION}s;
    }

    @keyframes main {
      from {
        transform: scale(1, 0.2);
      }

      to {
        transform: scale(1, 1);
      }
    }
  `);

  const approxLength = 7;
  range(NUM_RINGS).forEach(rIndex => {
    const radius =
      (rIndex * (MAX_RADIUS - MIN_RADIUS)) / (NUM_RINGS - 1) + MIN_RADIUS;
    const numLines = Math.floor((2 * Math.PI * radius) / approxLength);
    const lineLength = 2 * radius * Math.tan(Math.PI / numLines);

    const delay = (rIndex * DURATION) / NUM_RINGS;

    range(numLines).forEach(lIndex => {
      const angle = (lIndex * 360) / numLines - 90;

      svg
        .g({
          transform: `rotate(${angle}) translate(${radius}, 0) `,
        })
        .line({
          x1: 0,
          y1: -lineLength / 2,
          x2: 0,
          y2: lineLength / 2,
          style: {
            animationDelay: `-${delay}s`,
          },
        });
    });
  });

  return svg;
};
