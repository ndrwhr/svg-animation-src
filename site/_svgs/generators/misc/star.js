const range = require('lodash/range');
const seedrandom = require('seedrandom');
const SVG = require('../utils/SVG');

const rand = seedrandom(17);

const starPoints = [
  [50.1751845, 63.1130268],
  [37.1964708, 69.9363405],
  [39.6751845, 55.4843303],
  [29.1751845, 45.2493599],
  [43.6858276, 43.14084],
  [50.1751845, 29.9919668],
  [56.6645414, 43.14084],
  [71.1751845, 45.2493599],
  [60.6751845, 55.4843303],
  [63.1538983, 69.9363405],
].map(([x, y]) => [(x - 50) * 1.5, (y - 50) * 1.5 - 3]);

module.exports = id => {
  const DURATION = 1;
  const svg = SVG.svg({
    id,
    viewBox: '-50 -50 100 100',
    dataAnimationDuration: `${DURATION}s`,
  });

  svg.title('Magic!');

  svg.style(`
    rect {
      fill: black;
    }
    line {
      stroke: black;
      stroke-dasharray: 6, 9;
      animation:
          anim
          ${DURATION}s
          linear
          infinite;
    }
    @keyframes anim {
      from {
        stroke-dashoffset: 0;
      }
      to {
        stroke-dashoffset: -15%;
      }
    }
  `);

  svg.polygon({
    points: starPoints,
  });

  range(5).forEach(i => {
    svg.line({
      transform: `rotate(${(i * 360) / 5})`,
      x1: 0,
      y1: -37,
      x2: 0,
      y2: -45,
      strokeWidth: rand() * 1 + 1,
      style: {
        animationDelay: -rand() * DURATION + 's',
      },
    });
  });

  range(15).forEach(i => {
    if (i % 3 === 0) return;
    svg.line({
      transform: `rotate(${(i * 360) / 15})`,
      x1: 0,
      y1: -25,
      x2: 0,
      y2: -(40 + rand() * 10),
      strokeWidth: rand() * 0.5 + 0.5,
      style: {
        animationDelay: -rand() * DURATION + 's',
        animationDuration: 0.4 * DURATION + rand() * 0.1 + 's',
      },
    });
  });

  return svg;
};
