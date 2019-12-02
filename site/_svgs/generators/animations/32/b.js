const classNames = require('classnames');
const range = require('lodash/range');

const SVG = require('../../utils/SVG');
const { createPoints } = require('../../utils/Polygon');

const toRad = deg => (Math.PI * deg) / 180;

// SIN(PI() / 3) *$D$1  / SIN(PI() * (120 - A1) / 180)
const getTransforms = (numSides, angle) => {
  const polygonAngle = 90 * (1 - 2 / numSides);
  const otherAngle = 180 - polygonAngle - angle;
  const scale = Math.sin(toRad(polygonAngle)) / Math.sin(toRad(otherAngle));
  return `rotate(${angle}deg) scale(${scale})`;
};

module.exports = () => {
  const DURATION = 10;
  const NUM_SIDES = 4;
  const NUM_KEYFRAMES = 101;
  const NUM_NESTED = 10;
  const ANGLE = 360 / NUM_SIDES;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  const points = createPoints(NUM_SIDES, 40);

  const keyframes = range(NUM_KEYFRAMES)
    .map(i => {
      const angle = (i * ANGLE) / (NUM_KEYFRAMES - 1);
      return `
      ${(100 * i) / (NUM_KEYFRAMES - 1)}% {
        transform: ${getTransforms(NUM_SIDES, angle)}
      }
    `;
    })
    .join('\n');

  svg.style(`
    polygon {
      stroke: none;
      fill: white;
    }

    polygon.dark {
      fill: black;
    }

    .animated-group {
      animation: main-anim ${DURATION}s linear infinite;
    }

    @keyframes main-anim {
      ${keyframes}
    }
  `);

  svg.polygon({
    className: 'dark',
    points,
  });

  range(NUM_NESTED).reduce((parent, i) => {
    const group = parent.g({
      className: 'animated-group',
    });

    group.polygon({
      className: classNames({
        dark: i % 2 === 1,
      }),
      points,
    });

    return group;
  }, svg);

  return svg;
};
