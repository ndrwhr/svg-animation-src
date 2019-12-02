const { vec2 } = require('gl-matrix');
const range = require('lodash/range');

const SVG = require('../../utils/SVG');

module.exports = () => {
  const DURATION = 3;

  const WIDTH = 30;
  const HEIGHT = 30;
  const NUM_LINES = 20;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    rect {
      stroke: white;
      stroke-width: 0.3;
      fill: black;
      animation: main-anim ${DURATION}s ease-in-out infinite alternate;
      xanimation-play-state: paused;
    }

    @keyframes main-anim {
      from {
        transform: scale(1, -0.05);
      }
      to {
        transform: scale(1, -1);
      }
    }
  `);

  const mainGroup = svg.g({
    transform: `translate(0, ${HEIGHT / 2})`,
  });

  const angle = 30;
  const upperOffset = WIDTH * Math.tan((angle * Math.PI) / 180);
  [
    [-upperOffset, angle, 1],
    [-upperOffset, angle, -1],
    [upperOffset, -angle, 1],
    [upperOffset, -angle, -1],
  ].map(([y, a, sx]) => {
    const group = mainGroup.g({
      transform: `scale(${sx}, 1) skewY(${a}) translate(0, ${y})`,
    });
    const sideGroup = group.g({
      transform: `scale(-1, 1) translate(-${WIDTH}, 0)`,
    });

    range(NUM_LINES).forEach(i => {
      const h = HEIGHT / NUM_LINES;
      const barX = (i * HEIGHT) / NUM_LINES;

      sideGroup.rect({
        width: h,
        height: HEIGHT,
        x: barX,
        y: 0,
        style: {
          animationDelay: `-${(i * (DURATION * 1.5)) / NUM_LINES}s`,
        },
      });
    });

    return group;
  });

  return svg;
};
