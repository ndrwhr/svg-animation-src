const range = require('lodash/range');

const SVG = require('../../utils/SVG');

const sierpinski = (x, y, size, depth) => {
  const points = [];
  const newSize = size / 3;
  const newX = x + newSize;
  const newY = y + newSize;

  if (depth === 0) {
    return points;
  } else {
    points.push([newX, newY, newSize]);
    points.push(...sierpinski(x, y, newSize, depth - 1));
    points.push(...sierpinski(x + newSize, y, newSize, depth - 1));
    points.push(...sierpinski(x + newSize + newSize, y, newSize, depth - 1));

    points.push(...sierpinski(x, y + newSize, newSize, depth - 1));
    points.push(
      ...sierpinski(x + newSize + newSize, y + newSize, newSize, depth - 1),
    );

    points.push(...sierpinski(x, y + newSize + newSize, newSize, depth - 1));
    points.push(
      ...sierpinski(x + newSize, y + newSize + newSize, newSize, depth - 1),
    );
    points.push(
      ...sierpinski(
        x + newSize + newSize,
        y + newSize + newSize,
        newSize,
        depth - 1,
      ),
    );
  }

  return points;
};

module.exports = () => {
  const DURATION = 5;
  const SIZE = 70;
  const OFFSET = (100 - SIZE) / 2;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `0 0 100 100`,
  });

  svg.style(`
    rect {
      fill: black;
      stroke: none;
      animation: main-animation ${DURATION}s ease-in-out infinite alternate;
    }

    @keyframes main-animation {
      from {
        transform: scale(0.05);
      }
      to {
        transform: scale(1);
      }
    }
  `);

  sierpinski(0, 0, SIZE, 4).forEach(([x, y, size]) => {
    svg.rect({
      x: x + OFFSET,
      y: y + OFFSET,
      width: size,
      height: size,
      style: {
        transformOrigin: `${x + size / 2 + OFFSET}% ${y + size / 2 + OFFSET}%`,
      },
    });
  });

  return svg;
};
