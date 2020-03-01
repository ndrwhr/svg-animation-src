const range = require('lodash/range');

const SVG = require('../../utils/SVG');

const makePath = (curveWidth1, curveDepth1) => {
  const OFFSET = 100 / 2;
  const EXTENSIONS = 50;
  const upperCurveControlPoint = curveWidth1 * 0.4;
  const lowerCurveControlPoint = curveWidth1 * 0.2;

  return [
    `M-${EXTENSIONS},0`,
    `h${EXTENSIONS}`,
    `h${OFFSET - curveWidth1 / 2}`,
    `c${upperCurveControlPoint},0 ${curveWidth1 / 2 -
      lowerCurveControlPoint},${curveDepth1} ${curveWidth1 / 2},${curveDepth1}`,
    `c${lowerCurveControlPoint},0 ${curveWidth1 / 2 -
      upperCurveControlPoint},${-curveDepth1} ${curveWidth1 /
      2},${-curveDepth1}`,
    `h${OFFSET - curveWidth1 / 2}`,
    `h${EXTENSIONS}`,
  ].join(' ');
};

const getSinValues = numSteps => {
  const start = -Math.PI / 2;
  const end = (3 * Math.PI) / 2;
  const stepSize = (start - end) / (numSteps - 1);

  const min = 0;
  const max = 1;

  return range(numSteps).map(
    step => (Math.sin(step * stepSize + start) + 1) / 2,
  );
};

module.exports = () => {
  const DURATION = 3;

  const MIN_WIDTH = 50;
  const MAX_WIDTH = 80;
  const MIN_DEPTH = 0.001;
  const MAX_DEPTH = -20;

  const LINE_THICKNESS = 0.2;
  const LINE_OFFSET_FACTOR = 5;
  const STEP_SIZE = LINE_THICKNESS * LINE_OFFSET_FACTOR;
  const NUM_LINES = 13;

  const OVERALL_OFFSET = (100 - (NUM_LINES - 1) * STEP_SIZE) / 2;

  const svg = SVG.svg({
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

  svg
    .defs()
    .clipPath({
      id: 'mask',
    })
    .rect({
      x: 0,
      y: 0,
      height: 100,
      width: 100,
    });

  const mainGroup = svg.g({
    clipPath: `url(#mask)`,
  });

  const scaleValues = getSinValues(NUM_LINES);
  range(NUM_LINES).forEach(i => {
    const y = i * STEP_SIZE;
    const depth = scaleValues[i] * (MAX_DEPTH - MIN_DEPTH) + MIN_DEPTH;
    const width = scaleValues[i] * (MAX_WIDTH - MIN_WIDTH) + MIN_WIDTH;

    mainGroup
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

module.exports.attribution =
  'Inspired by [this pin](https://pin.it/wiedw45nag5owj) (original artist unknown).';
