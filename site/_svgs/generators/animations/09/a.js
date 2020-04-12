const range = require('lodash/range');
const { vec2 } = require('gl-matrix');

const SVG = require('../../utils/SVG');
const { createPoints } = require('../../utils/Polygon');

module.exports = () => {
  const rectWidth = 7;
  const rectHeight = rectWidth * 1.618 * 2;
  const numRects = 5;
  const totalWidth = rectWidth * numRects;
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
        transform: translate(0, 5%);
      }

      to {
        transform: translate(0, -5%);
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
