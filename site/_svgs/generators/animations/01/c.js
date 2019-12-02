const range = require('lodash/range')

const SVG = require('../../utils/SVG')

module.exports = id => {
  const numSquares = 16;
  const ANGLE_OFFSET = 360 / numSquares;
  const DURATION = 15;

  const SQUARE_SIZE = 25;
  const TRANSLATION_OFFSET = SQUARE_SIZE * 0.75;

  const squareArgs = {
    x: -SQUARE_SIZE / 2,
    y: -SQUARE_SIZE / 2,
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
  };

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    rect {
      stroke-width: 0.2;
      stroke: black;
      fill: none;
    }

    .inner-group:nth-child(even) rect {
      transform-origin: 0 0 ;
      animation: rect ${DURATION / 3}s infinite linear;
    }

    .inner-group:nth-child(odd) rect {
      transform-origin: 0 0 ;
      animation: rect ${DURATION / 3}s infinite linear reverse;
    }

    .outer-group {
      transform-origin: 0 0;
      animation: outer-group ${DURATION}s infinite linear;
    }

    @keyframes outer-group {
      from {
        transform: rotate(360deg);
      }
      to {
        transform: rotate(0deg);
      }
    }

    @keyframes rect {
      to {
        transform: rotate(360deg);
      }
      from {
        transform: rotate(0deg);
      }
    }
  `);

  const outerGroup = svg.g({
    className: 'outer-group',
  });

  range(numSquares).forEach(index => {
    outerGroup
      .g({
        className: 'inner-group',
        transform: `rotate(${ANGLE_OFFSET *
          index}) translate(0 ${TRANSLATION_OFFSET})`,
      })
      .rect(squareArgs);
  });

  return svg;
};
