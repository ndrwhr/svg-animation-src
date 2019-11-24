const range = require('lodash/range');

const SVG = require('../../utils/SVG');

const make_s = (id, delayFn) => {
  const DURATION = 5;
  const NUM_LINES = 11;
  const OUTER_RADIUS = 31;
  const INNER_RADIUS = 3;
  const THICKNESS = OUTER_RADIUS - INNER_RADIUS;
  const MAX_STROKE_WIDTH = 0.1;
  const MIN_STROKE_WIDTH = 0.1;

  const dashArray = [6, 2, 12, 2, 3, 2];
  const dashArrayLength = dashArray.reduce((s, v) => s + v, 0);
  // const dashArray = dashArray.map(v => `${v}%`).join(',');

  function makeLine(offset) {
    const upperR = OUTER_RADIUS - offset;
    const lowerR = OUTER_RADIUS - THICKNESS + offset;

    const startEndOffset = THICKNESS / 4;

    return [
      // Start in the top right.
      `M ${100 - startEndOffset} ${offset}`,

      // Immediately before curve.
      `L ${OUTER_RADIUS + MAX_STROKE_WIDTH} ${offset}`,

      // Left curve.
      `a ${upperR} ${upperR} 0 1 0 0 ${upperR * 2}`,

      // Straight line to start of second curve.
      `L ${100 - OUTER_RADIUS - MAX_STROKE_WIDTH} ${offset + upperR * 2}`,

      // Right curve.
      `a ${lowerR} ${lowerR} 0 1 1 0 ${lowerR * 2}`,

      // End of the S.
      `L ${startEndOffset} ${offset + upperR * 2 + lowerR * 2}`,
    ].join(' ');
  }

  const svg = SVG.svg({
    id,
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '0 0 100 100',
  });

  const style = svg.style(`
    path {
      fill: none;
      stroke: black;
      stroke-width: ${MAX_STROKE_WIDTH};
      stroke-dasharray: ${dashArray.map(v => `${v}%`).join(',')};
      animation: main-anim ${DURATION}s linear infinite;
    }

    path:nth-child(odd) {
      animation-direction: reverse;
    }

    @keyframes main-anim {
      from {
        stroke-dashoffset: 0;
      }
      to {
        stroke-dashoffset: -${dashArrayLength}%;
      }
    }
  `);

  const step = THICKNESS / (NUM_LINES - 1);
  const strokeStep =
    (MAX_STROKE_WIDTH - MIN_STROKE_WIDTH) / ((NUM_LINES - 1) / 2);
  const g = svg.g({
    transform: `translate(0 ${MAX_STROKE_WIDTH})`,
  });
  range(NUM_LINES).forEach(i => {
    const offset = step * i + (0 * MAX_STROKE_WIDTH) / 2;
    g.path({
      d: makeLine(offset),
    });

    // style.addStyles(`
    //   path:nth-child(${i + 1}) {
    //     stroke-width: ${(strokeStep * i) + MIN_STROKE_WIDTH};
    //   }
    // `);
  });

  return svg;
};

module.exports = id => make_s(id, (numLines, i) => 2 - (i * 2) / numLines);
module.exports.make_s = make_s;
