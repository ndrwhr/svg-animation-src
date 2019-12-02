const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { createPoints } = require('../../utils/Polygon')

module.exports = id => {
  const rectWidth = 22;
  const rectHeight = rectWidth / 1.618 / 2;
  const numRects = 5;
  const totalHeight = rectHeight * numRects;
  const animationDuration = 1;

  const svg = SVG.svg({
    dataAnimationDuration: `${animationDuration}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    rect {
      stroke: black;
      stroke-width: 1;
      fill: none;
    }

    .rect-group {
      animation: rect-group-anim ${animationDuration}s ease-in-out infinite alternate;
    }

    @keyframes rect-group-anim {
      from {
        transform: translate(-5%, 0);
      }

      to {
        transform: translate(5%, 0);
      }
    }
  `);

  const shapes = svg.g({
    transform: `translate(0, -${totalHeight / 2})`,
  });

  range(numRects).forEach(index => {
    const delay = (numRects - 1 - index) * (animationDuration / numRects);
    shapes
      .g({
        transform: `translate(0, ${index * rectHeight})`,
      })
      .g({
        className: 'rect-group',
        style: { animationDelay: `-${delay}s` },
      })
      .rect({
        x: -rectWidth / 2,
        y: -rectHeight / 2,
        width: rectWidth,
        height: rectHeight,
      });
  });

  return svg;
};
