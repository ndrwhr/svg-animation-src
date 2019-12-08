const range = require('lodash/range');

const SVG = require('../../utils/SVG');

const make = options => () => {
  const SQUARE_SIZE = 10;
  const HALF_SQUARE_SIZE = SQUARE_SIZE / 2;
  const PADDING = 2;
  const GRID_SIZE = 7;
  const DURATION = 3;

  const TIMING_OFFSET = 0.5;
  const TIMING_FUNCTION = `cubic-bezier(${TIMING_OFFSET}, 0, ${1 -
    TIMING_OFFSET}, 1)`;
  const TOTAL_SIZE = PADDING * (GRID_SIZE - 1) + SQUARE_SIZE * GRID_SIZE;
  const OFFSET = (100 - TOTAL_SIZE) / 2;

  const RADIUS = SQUARE_SIZE * 0.05;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '0 0 100 100',
  });

  svg.style(`
    .background-rect {
      fill: black;
      animation: background-anim ${DURATION}s ${TIMING_FUNCTION} infinite alternate;
    }

    @keyframes background-anim {
      0% {
        transform: rotate(90deg);
      }
      100% {
        transform: rotate(-90deg);
      }
    }
  `);

  const defs = svg.defs();

  range(GRID_SIZE).forEach(rowIndex => {
    range(GRID_SIZE).forEach(colIndex => {
      const x =
        (rowIndex + 1) * HALF_SQUARE_SIZE +
        rowIndex * (PADDING + HALF_SQUARE_SIZE);
      const y =
        (colIndex + 1) * HALF_SQUARE_SIZE +
        colIndex * (PADDING + HALF_SQUARE_SIZE);

      const id = `grid-clip-path-${rowIndex}-${colIndex}`;
      defs
        .clipPath({
          id,
        })
        .rect(
          Object.assign({
            rx: RADIUS,
            ry: RADIUS,
            x: x - HALF_SQUARE_SIZE + OFFSET,
            y: y - HALF_SQUARE_SIZE + OFFSET,
            width: SQUARE_SIZE,
            height: SQUARE_SIZE,
          }),
        );

      const rectX = x - SQUARE_SIZE + OFFSET;
      const rectY = y + HALF_SQUARE_SIZE / 8 + OFFSET;
      svg.g({ clipPath: `url(#${id})` }).rect({
        className: 'background-rect',
        x: rectX,
        y: rectY,
        width: SQUARE_SIZE * 2,
        height: SQUARE_SIZE * 2,
        style: {
          transformOrigin: `${rectX + SQUARE_SIZE}% ${rectY}%`,
          animationDelay: `-${(options.timeOffset(
            rowIndex,
            colIndex,
            GRID_SIZE,
          ) *
            DURATION) /
            2}s`,
        },
      });
    });
  });

  return svg;
};

module.exports = make({
  timeOffset: (rowIndex, colIndex, gridSize) => 0,
});
module.exports.make = make;

module.exports.attribution =
  'Based on [SE.BS 24-30](https://www.dailyminimal.com/post/189412440869/sebs-24-30-a-new-geometric-design-every-day) by [Pierre Voisin](https://www.designbypierre.io/) at [DAILYMINIMAL](https://www.dailyminimal.com/).';
