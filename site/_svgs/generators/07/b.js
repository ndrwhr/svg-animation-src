const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const { createPoints } = require('../../utils/Polygon')
const SVG = require('../../utils/SVG')

module.exports = id => {
  const NUM_POINTS = 8;
  const NUM_RINGS = 5;
  const DURATION = 10;
  const NUM_MASKS = 4;
  const RADIUS = 50 || Math.sqrt(50 * 50 + 50 * 50);
  const TIME_STEP = DURATION / NUM_RINGS;

  const svg = SVG.svg({
    id,
    dataAnimationDuration: `${DURATION / NUM_RINGS}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    polygon {
      fill: none;
      stroke: black;
      animation: main-anim ${DURATION}s linear infinite;
      xanimation-play-state: paused;
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
  range(NUM_MASKS).forEach(i => {
    const offset = 0.5;
    const center = -offset;
    clipPath.path({
      d: 'M0,0 C25,0 50,10 50,50 C10,50 0,25 0,0 Z',
      transform: `translate(${offset}, ${offset}) rotate(${i *
        (360 / NUM_MASKS) -
        45}, ${center} ${center}) scale(0.8)`,
      fill: 'black',
      stroke: 'none',
    });
  });

  const group1 = svg.g({
    clipPath: 'url(#mask-0)',
  });

  range(NUM_RINGS).forEach(i => {
    const delay = TIME_STEP * i;

    const points = createPoints(
      NUM_POINTS,
      RADIUS,
      // 45,
    );

    group1.polygon({
      points,
      style: {
        animationDelay: `-${(i * DURATION) / NUM_RINGS}s`,
      },
    });
  });

  const group2 = svg.g({
    clipPath: 'url(#mask-0)',
    transform: 'rotate(45)',
  });

  range(NUM_RINGS).forEach(i => {
    const delay = TIME_STEP * i + TIME_STEP / 2;

    const points = createPoints(
      NUM_POINTS,
      RADIUS,
      // 45,
    );

    group2.polygon({
      points,
      style: {
        animationDelay: `-${delay}s`,
      },
    });
  });

  return svg;
};
