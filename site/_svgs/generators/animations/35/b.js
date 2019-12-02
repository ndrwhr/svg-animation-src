const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')

module.exports = () => {
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

  const defs = svg.defs();
  defs
    .clipPath({
      id: 'right-clip',
    })
    .rect({
      x: 0,
      y: -50,
      height: 100,
      width: MIN_LENGTH,
    });
  defs
    .clipPath({
      id: 'left-clip',
    })
    .rect({
      x: -MIN_LENGTH,
      y: -50,
      height: 100,
      width: MIN_LENGTH,
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

  const rightGroup = svg.g({
    clipPath: 'url(#right-clip)',
  });
  const leftGroup = svg.g({
    clipPath: 'url(#left-clip)',
  });

  range(NUM_LINES).forEach(i => {
    const delay = (NUM_LINES - 1 - i) * (DURATION / NUM_LINES);
    const x = MIN_LENGTH;
    const y = i * (SIZE / NUM_LINES) - SIZE / 2;
    const lineDef = {
      x1: -LENGTH,
      y1: 0,
      x2: 0,
      y2: 0,
      style: {
        animationDelay: `-${delay}s`,
      },
    };

    rightGroup
      .g({
        transform: `translate(${x}, ${y})`,
      })
      .line(lineDef);

    leftGroup
      .g({
        transform: `translate(-${x}, ${y}) scale(-1, 1)`,
      })
      .line(lineDef);
  });

  return svg;
};
