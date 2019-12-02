const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')

const NUM_PER_ROW = 7;

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
  const DURATION = 1.5;
  const OFFSET = 4;
  const R = 2;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    circle {
      fill: black;
      stroke: none;
      animation: main-anim ${DURATION}s ease-in-out infinite alternate;
    }

    @keyframes main-anim {
      from {
        transform: translate(-${OFFSET}%, 0);
      }
      to {
        transform: translate(${OFFSET}%, 0);
      }
    }
  `);

  createPoints().forEach((row, rowIndex) => {
    row.forEach(([cx, cy], colIndex, cols) => {
      const delay = (cols.length - 1 - colIndex) * (DURATION / row.length);
      svg
        .g({
          transform: `translate(${cx}, ${cy})`,
        })
        .circle({
          r: R,
          style: {
            animationDelay: `-${delay}s`,
          },
        });
    });
  });

  return svg;
};
