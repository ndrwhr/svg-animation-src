const range = require('lodash/range')

const SVG = require('../../utils/SVG')
const { createPoints } = require('../../utils/Polygon')

module.exports = id => {
  const NUM_NESTED_CIRCLES = 15;
  const RADIUS = 24;
  const DURATION = 3;
  const MAX_OFFSET = RADIUS * 0.6;
  const MIN_OFFSET = RADIUS * 0.1;
  const LINE_THICKNESS = 0.2;
  const TIMING_OFFSET = 0.5;
  const TIMING_FUNCTION = `cubic-bezier(${TIMING_OFFSET}, 0, ${1 -
    TIMING_OFFSET}, 1)`;

  const points = createPoints(4, RADIUS);

  const svg = SVG.svg({
    id,
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `-50 -50 100 100`,
  });

  const defs = svg.defs();

  defs
    .clipPath({
      id: 'left-clip',
    })
    .polygon({
      className: 'left-polygon',
      points,
    });

  defs
    .clipPath({
      id: 'main-clip',
      clipPath: 'url(#left-clip)',
    })
    .polygon({
      className: 'right-polygon',
      points,
    });

  svg.style(`
    polygon {
      stroke: black;
      stroke-width: ${LINE_THICKNESS};
      fill: none;
    }

    .left-polygon,
    .right-polygon {
      animation: ${DURATION}s ${TIMING_FUNCTION} infinite alternate -${DURATION /
    2}s;
    }

    .left-polygon {
      animation-name: left-animation;
    }

    .right-polygon {
      animation-name: right-animation;
    }

    line {
      stroke: black;
      stroke-width: ${LINE_THICKNESS};
    }

    @keyframes left-animation {
      from {
        transform: translate(-${MIN_OFFSET}%, 0);
      }
      to {
        transform: translate(-${MAX_OFFSET}%, 0);
      }
    }

    @keyframes right-animation {
      from {
        transform: translate(${MIN_OFFSET}%, 0);
      }
      to {
        transform: translate(${MAX_OFFSET}%, 0);
      }
    }
  `);

  const intersectionGroup = svg
    .g({
      clipPath: 'url(#main-clip)',
    })
    .g({
      transform: 'rotate(-75)',
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

  svg.polygon({
    className: 'left-polygon',
    points,
  });

  svg.polygon({
    className: 'right-polygon',
    points,
  });

  return svg;
};
