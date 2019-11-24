const range = require('lodash/range')

const SVG = require('../../utils/SVG')
const { createAngles, createPoints } = require('../../utils/Polygon')

module.exports = id => {
  const DURATION = 10;
  const NUM_POINTS = 25;

  const svg = SVG.svg({
    id,
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-100 -100 200 200',
  });

  svg.style(`
    rect {
      stroke: black;
      stroke-width: 0.2;
      fill: none;
      animation: rect-rotate ${DURATION}s infinite linear;
    }

    .rect-group {
      animation: rect-group-move ${DURATION /
        2}s infinite ease-in-out alternate;
    }

    .outer-group {
      animation: rect-rotate ${DURATION}s infinite ease-in-out alternate;
    }

    @keyframes rect-group-move {
      from {
        transform: translate(0, -5%);
      }

      to {
        transform: translate(0, 5%);
      }
    }

    @keyframes rect-rotate {
      from {
        transform: rotate(0);
      }

      to {
        transform: rotate(360deg);
      }
    }
  `);

  const outerGroup = svg.g({
    className: 'outer-group',
  });

  const NUM_INSTANCES = 3;
  range(NUM_INSTANCES).forEach(i => {
    const delay = DURATION * (i / (NUM_INSTANCES - 1));

    createAngles(NUM_POINTS).forEach(angle => {
      outerGroup
        .g({
          transform: `rotate(${angle}) translate(0, -50)`,
          style: {
            animationDelay: `-${delay}s`,
          },
        })
        .g({
          className: 'rect-group',
          style: {
            animationDelay: `-${delay / 2}s`,
          },
        })
        .rect({
          x: -5,
          y: -5,
          width: 10,
          height: 10,
        });
    });
  });

  return svg;
};
