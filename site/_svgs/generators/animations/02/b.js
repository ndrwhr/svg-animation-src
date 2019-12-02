const range = require('lodash/range')

const SVG = require('../../utils/SVG')
const { createPoints, getPerimiterLength } = require('../../utils/Polygon')

module.exports = id => {
  const DURATION = 20;
  const NUM_POINTS = 7;
  const NUM_LINES = NUM_POINTS;
  const MIN_LINE_RADIUS = 5;
  const MAX_LINE_RADIUS = 95;

  const MAX_STROKE_WIDTH = 0.5;
  const MIN_STROKE_WIDTH = 0.2;

  const MAX_NUM_DASHES = NUM_POINTS * 2;
  const MIN_NUM_DASHES = 2;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-100 -100 200 200',
  });

  svg.style(`
    polygon {
      stroke: black;
      stroke-width: 0.2;
      fill: none;
    }
  `);

  const polygonGroup = svg.g();

  range(NUM_LINES).forEach(index => {
    const radius =
      MIN_LINE_RADIUS +
      (index * (MAX_LINE_RADIUS - MIN_LINE_RADIUS)) / (NUM_LINES - 1);

    const points = createPoints(NUM_POINTS, radius)
      .map(point => {
        return point.join(',');
      })
      .join(' ');
    const perimiterLength = getPerimiterLength(NUM_POINTS, radius);

    // const numDashes = 10;
    const numDashes = Math.floor(
      MIN_NUM_DASHES +
        (index * (MAX_NUM_DASHES - MIN_NUM_DASHES)) / (NUM_LINES - 1),
    );

    const dashLength = perimiterLength / numDashes / 3;
    const dashGapLength = perimiterLength / numDashes - dashLength;

    const strokeWidth =
      MAX_STROKE_WIDTH -
      (index * (MAX_STROKE_WIDTH - MIN_STROKE_WIDTH)) / (NUM_LINES - 1);

    svg.style(`
      polygon:nth-child(${index + 1}) {
        stroke-width: ${strokeWidth};
        stroke-dasharray: ${dashLength}, ${dashGapLength};
        animation: dash-n-${index + 1} ${DURATION}s infinite linear;
        animation-direction: ${index % 2 ? 'normal' : 'reverse'};
      }
      @keyframes dash-n-${index + 1} {
        from {
          stroke-dashoffset: 0;
        }
        to {
          stroke-dashoffset: ${perimiterLength};
        }
      }
    `);

    polygonGroup.polygon({
      points,
      transform: `rotate(${(index * 360) / NUM_POINTS / 2})`,
    });
  });

  return svg;
};
