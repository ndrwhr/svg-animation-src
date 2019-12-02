const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')

module.exports = id => {
  const DURATION = 2;
  const NUM_LINES = 20;
  const SIZE = 70;
  const LENGTH = 40;
  const ANGLE = 12;
  const MIN_LENGTH = Math.cos((ANGLE * Math.PI) / 180) * LENGTH;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  svg
    .defs()
    .clipPath({
      id: 'main-clip',
    })
    .rect({
      x: -MIN_LENGTH,
      y: -50,
      height: 100,
      width: MIN_LENGTH * 2,
    });

  svg.style(`
    line {
      stroke: black;
      stroke-width: 0.2;
      animation: main-anim ${DURATION / 2}s ease-in-out infinite alternate;
    }

    @keyframes main-anim {
      from {
        transform: rotate(-${ANGLE}deg);
      }
      to {
        transform: rotate(${ANGLE}deg);
      }
    }
  `);

  const mainGroup = svg.g({
    clipPath: 'url(#main-clip)',
  });
  range(NUM_LINES).forEach(i => {
    const delay = (NUM_LINES - 1 - i) * (DURATION / NUM_LINES);
    const y = i * (SIZE / NUM_LINES) - SIZE / 2;
    const lineDef = {
      x1: 0,
      y1: 0,
      x2: LENGTH,
      y2: 0,
      style: {
        animationDelay: `-${delay}s`,
      },
    };
    mainGroup
      .g({
        transform: `translate(0, ${y})`,
      })
      .line(lineDef);
    mainGroup
      .g({
        transform: `translate(0, ${y}) scale(-1, 1)`,
      })
      .line(lineDef);
  });

  return svg;
};
