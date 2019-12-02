const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')

const createPoints = () => {
  const SIZE = 200;
  const OFFSET = -(SIZE / 2);
  const CELLS = 10;
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

module.exports = id => {
  const DURATION = 2;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-100 -100 200 200',
  });

  const OFFSET = 200 / 11 / 8;

  svg.style(`
    .outline-circle {
      fill: none;
      stroke: black;
      stroke-width: 0.5;

      animation: first-circle ${DURATION}s infinite ease-in-out alternate;
    }

    .inner-circle {
      fill: black;
      stroke: none;
    }

    @keyframes first-circle {
      from {
        r: 2;
      }

      to {
        r: 4;
      }
    }
  `);

  createPoints().forEach((row, rowIndex, rows) => {
    const delay = (rows.length - 1 - rowIndex) * (DURATION / rows.length);
    row.forEach(([cx, cy], colIndex) => {
      const g = svg.g();

      g.circle({
        className: 'inner-circle',
        cx,
        cy,
        r: 2,
      });

      g.g({
        transform: `translate(${cx}, ${cy})`,
      }).circle({
        cx: 0,
        cy: 0,
        r: 2,
        className: 'outline-circle',
        style: {
          animationDelay: `-${delay}s`,
        },
      });
    });
  });

  return svg;
};
