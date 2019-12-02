const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')

const NUM_PER_ROW = 8;

const createPoints = () => {
  const SIZE = 80;
  const OFFSET = -(SIZE / 2);
  const CELLS = NUM_PER_ROW;
  const STEP = SIZE / (CELLS + 1);

  return range(1, CELLS + 1).reduce((rows, rowIndex) => {
    const row = range(1, CELLS + 1).reduce((cells, colIndex) => {
      return [
        ...cells,
        vec2.fromValues(rowIndex * STEP + OFFSET, colIndex * STEP + OFFSET),
      ];
    }, []);

    return [...rows, row];
  }, []);

  return points;
};

module.exports = () => {
  const DURATION = 2;
  const OFFSET = 2;
  const R = 2;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    circle {
      fill: black;
      stroke: none;
      animation: main-anim ${DURATION}s infinite linear;
    }

    @keyframes main-anim {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `);

  createPoints().forEach((row, rowIndex, rows) => {
    row.forEach(([cx, cy], colIndex) => {
      svg
        .g({
          transform: `translate(${cx}, ${cy})`,
        })
        .circle({
          cx: OFFSET,
          cy: OFFSET,
          r: R,
          style: {
            animationDelay: `-${(rows.length - 1 - rowIndex) * 200}ms`,
          },
        });
    });
  });

  return svg;
};
