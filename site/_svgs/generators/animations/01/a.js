const range = require('lodash/range');
const SVG = require('../../utils/SVG');

module.exports = () => {
  const DURATION = 15;
  const numSquares = 4;
  const ANGLE_OFFSET = 360 / numSquares;

  const SQUARE_SIZE = 25;
  const TRANSLATION_OFFSET = SQUARE_SIZE * 0.75;

  const squareArgs = {
    x: -SQUARE_SIZE / 2,
    y: -SQUARE_SIZE / 2,
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
  };

  const svg = SVG.svg({
    viewBox: '-50 -50 100 100',
    dataAnimationDuration: `${DURATION}s`,
  });

  svg.style(`
    rect {
      stroke-width: 0.2;
      stroke: black;
      fill: none;
    }

    .inner-group:nth-child(even) rect {
      transform-origin: 0 0;
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

module.exports.desc = `
This is the animation that sparked this entire experiment.

Sometime in early 2018, I decided to learn a little about SVG's \`<animate/>\` element. However after playing around with it for a while I decided to lean into using CSS animations. From past experience I knew that I could style SVGs using CSS (see the controls of my [Chaos Game experiment](https://andrew.wang-hoyer.com/experiments/chaos-game/)), but I did not know that you could include full stylesheets inside of SVGs.
`;
