const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')

module.exports = () => {
  const NUM_CIRCLES = 5;
  const DURATION = 10;
  const TIME_STEP = DURATION / NUM_CIRCLES;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    circle {
      stroke: black;
      fill: none;
      animation: main-anim ${DURATION}s linear infinite;
    }

    @keyframes main-anim {
      from {
        transform: scale(0);
        stroke-width: 3;
      }
      to {
        transform: scale(1);
        stroke-width: 0.01;
      }
    }
  `);

  const defs = svg.defs();
  const maskGroup = defs.g({
    id: 'mask-group',
  });

  const clipPath = defs.clipPath({
    id: 'mask-0',
  });
  range(4).forEach(i => {
    const offset = 0.5;
    const center = -offset;
    clipPath.path({
      d: 'M0,0 C25,0 50,10 50,50 C10,50 0,25 0,0 Z',
      transform: `translate(${offset}, ${offset}) rotate(${i * 90 -
        45}, ${center} ${center}) scale(0.8)`,
      fill: 'black',
      stroke: 'none',
    });
  });

  const group1 = svg.g({
    clipPath: 'url(#mask-0)',
  });

  range(NUM_CIRCLES).forEach(i => {
    const delay = TIME_STEP * i;
    group1.circle({
      cx: 0,
      cy: 0,
      r: 50,
      style: { animationDelay: `-${delay}s` },
    });
  });

  const group2 = svg.g({
    clipPath: 'url(#mask-0)',
    transform: 'rotate(45)',
  });

  range(NUM_CIRCLES).forEach(i => {
    const delay = TIME_STEP * i + TIME_STEP / 2;
    group2.circle({
      cx: 0,
      cy: 0,
      r: 50,
      style: { animationDelay: `-${delay}s` },
    });
  });

  return svg;
};
