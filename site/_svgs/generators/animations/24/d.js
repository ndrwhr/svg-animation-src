const range = require('lodash/range');

const SVG = require('../../utils/SVG');
const { createPoints } = require('../../utils/Polygon');

module.exports = () => {
  const NUM_NESTED_CIRCLES = 15;
  const RADIUS = 24;
  const DURATION = 20;
  const OFFSET = RADIUS * 0.3;
  const LINE_THICKNESS = 0.2;

  const points = createPoints(4, RADIUS);

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `-50 -50 100 100`,
  });

  const defs = svg.defs();

  defs
    .clipPath({
      id: 'left-clip',
      transform: `translate(${OFFSET}, 0)`,
    })
    .polygon({
      points,
    });

  defs
    .clipPath({
      id: 'main-clip',
      clipPath: 'url(#left-clip)',
      transform: `translate(-${OFFSET}, 0)`,
    })
    .polygon({
      style: {
        animationDirection: 'reverse',
      },
      points,
    });

  svg.style(`
    polygon {
      stroke: black;
      stroke-width: ${LINE_THICKNESS};
      fill: none;
      animation: main-animation ${DURATION}s linear infinite -${DURATION / 2}s;
    }

    line {
      stroke: black;
      stroke-width: ${LINE_THICKNESS};
    }

    @keyframes main-animation {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(-1turn);
      }
    }
  `);

  const intersectionGroup = svg.g({
    clipPath: 'url(#main-clip)',
  });

  const stepSize = LINE_THICKNESS * 5;
  range(Math.floor(100 / stepSize)).forEach(index => {
    const y = stepSize * index - 50;
    intersectionGroup.line({
      x1: -50,
      y1: y,
      x2: 50,
      y2: y,
    });
  });

  svg
    .g({
      transform: `translate(${OFFSET}, 0)`,
    })
    .polygon({
      points,
    });

  svg
    .g({
      transform: `translate(-${OFFSET}, 0)`,
    })
    .polygon({
      style: {
        animationDirection: 'reverse',
      },
      points,
    });

  return svg;
};

module.exports.attribution =
  'Based on [AP15-183](https://www.dailyminimal.com/post/116562808399/ap15-183-a-new-geometric-design-every-day) by [Pierre Voisin](https://www.designbypierre.io/) at [DAILYMINIMAL](https://www.dailyminimal.com/).';
