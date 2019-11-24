const range = require('lodash/range')

const SVG = require('../../utils/SVG')

const makePath = (curveWidth, curveDepth) => {
  const EXTENSIONS = 50;
  const upperCurveControlPoint = curveWidth * 0.4;
  const lowerCurveControlPoint = curveWidth * 0.2;

  return [
    `M-${EXTENSIONS},0`,
    `h${EXTENSIONS}`,
    `h${50 - curveWidth / 2}`,
    `c${upperCurveControlPoint},0 ${curveWidth / 2 -
      lowerCurveControlPoint},${curveDepth} ${curveWidth / 2},${curveDepth}`,
    `c${lowerCurveControlPoint},0 ${curveWidth / 2 -
      upperCurveControlPoint},${-curveDepth} ${curveWidth / 2},${-curveDepth}`,
    `h${50 - curveWidth / 2}`,
    `h${EXTENSIONS}`,
  ].join(' ');
};

module.exports = id => {
  const DURATION = 3;

  const MIN_WIDTH = 40;
  const MAX_WIDTH = 80;
  const MIN_DEPTH = -1;
  const MAX_DEPTH = -20;

  const LINE_THICKNESS = 0.2;
  const LINE_OFFSET_FACTOR = 5;
  const STEP_SIZE = LINE_THICKNESS * LINE_OFFSET_FACTOR;
  const NUM_LINES = 13;

  const OVERALL_OFFSET = (100 - (NUM_LINES - 1) * STEP_SIZE) / 2;

  const svg = SVG.svg({
    id,
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `0 0 100 100`,
  });

  svg.style(`
    path {
      stroke: black;
      stroke-width: ${LINE_THICKNESS};
      fill: white;
      animation: main-anim ${DURATION}s ease-in-out infinite alternate;
    }

    @keyframes main-anim {
      from {
        transform: translate(-${MIN_WIDTH / 5}%, 0);
      }
      to {
        transform: translate(${MIN_WIDTH / 5}%, 0);
      }
    }
  `);

  range(NUM_LINES).forEach(i => {
    const y = i * STEP_SIZE;
    const depth = (i * (MAX_DEPTH - MIN_DEPTH)) / NUM_LINES + MIN_DEPTH;
    const width = (i * (MAX_WIDTH - MIN_WIDTH)) / NUM_LINES + MIN_WIDTH;
    svg
      .g({
        transform: `translate(0, ${y + OVERALL_OFFSET})`,
      })
      .path({
        d: makePath(width, depth),
        style: {
          animationDelay: `-${i * (DURATION / NUM_LINES) * 2}s`,
        },
      });
  });

  return svg;
};
