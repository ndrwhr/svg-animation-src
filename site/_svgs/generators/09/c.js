const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { createPoints } = require('../../utils/Polygon')

module.exports = id => {
  const rectWidth = 7;
  const rectHeight = rectWidth * 1.618 * 2;
  const numRects = 10;
  const totalWidth = rectWidth * numRects;
  const animationDuration = 1;

  const svg = SVG.svg({
    id,
    dataAnimationDuration: `${animationDuration}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    rect {
      stroke: black;
      stroke-width: 1;
      fill: none;
      animation: rect-anim ${animationDuration}s ease-in-out infinite alternate;
    }

    @keyframes rect-anim {
      from {
        transform: translateY(0%);
        height: ${rectHeight}%;
      }

      to {
        transform: translateY(${rectHeight * 0.75}%);
        height: ${rectHeight / 4}%;
      }
    }
  `);

  const shapes = svg.g({
    transform: `translate(-${totalWidth / 2}, 0)`,
  });

  range(numRects).forEach(index => {
    const delay = (numRects - 1 - index) * (animationDuration / numRects);
    shapes
      .g({
        transform: `translate(${index * rectWidth}, 0)`,
      })
      .rect({
        x: -rectWidth / 2,
        y: -rectHeight / 2,
        width: rectWidth,
        height: rectHeight,
        style: { animationDelay: `-${delay}s` },
      });
  });

  return svg;
};
