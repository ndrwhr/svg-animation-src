const range = require('lodash/range')

const SVG = require('../../utils/SVG')
const { createPoints } = require('../../utils/Polygon')

module.exports = id => {
  const NUM_NESTED_CIRCLES = 15;
  const RADIUS = 20;
  const DURATION = 3;
  const MAX_OFFSET = RADIUS * 0.7;
  const MIN_OFFSET = RADIUS * 0.1;
  const LINE_THICKNESS = 0.2;
  const TIMING_OFFSET = 0.5;
  const TIMING_FUNCTION = `cubic-bezier(${TIMING_OFFSET}, 0, ${1 -
    TIMING_OFFSET}, 1)`;

  const NUM_SHAPES = 2;
  const ANGLE = 360 / NUM_SHAPES;

  const trianglePoints = createPoints(3, MAX_OFFSET - MIN_OFFSET);

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `-50 -50 100 100`,
  });

  const defs = svg.defs();

  range(NUM_SHAPES).forEach(index => {
    const angle = ANGLE * index;
    const clipPath = index !== 0 ? `url(#clip-${index})` : undefined;
    defs
      .clipPath({
        id: `clip-${index + 1}`,
        transform: `rotate(${angle})`,
        clipPath,
      })
      .circle({
        r: RADIUS,
        cx: MAX_OFFSET,
        cy: 0,
      });
  });

  svg.style(`
    circle {
      stroke: black;
      stroke-width: ${LINE_THICKNESS};
      fill: none;
      animation: main-animation ${DURATION}s ${TIMING_FUNCTION} infinite alternate;
    }

    .clip-circle {
      fill: black;
    }

    line {
      stroke: black;
      stroke-width: ${LINE_THICKNESS};
    }

    @keyframes main-animation {
      from {
        transform: translate(0, 0);
      }
      to {
        transform: translate(-${MAX_OFFSET - MIN_OFFSET}%, 0);
      }
    }
  `);

  const intersectionGroup = svg
    .g({
      clipPath: `url(#clip-${NUM_SHAPES})`,
    })
    .g({
      transform: 'rotate(-10)',
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

  range(NUM_SHAPES).forEach(index => {
    const angle = ANGLE * index;
    svg
      .g({
        transform: `rotate(${angle})`,
      })
      .circle({
        r: RADIUS,
        cx: MAX_OFFSET,
        cy: 0,
      });
  });

  return svg;
};
