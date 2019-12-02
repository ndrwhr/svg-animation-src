const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')

module.exports = () => {
  const ORBIT_RADIUS_X = 40;
  const ORBIT_RADIUS_Y = 10;

  const ORBIT_PERIOD = 10;
  const ORBIT_PERIOD_Y_OFFSET = ORBIT_PERIOD / 4;

  const MIN_SCALE = 0.5;

  const svg = SVG.svg({
    dataAnimationDuration: `${ORBIT_PERIOD}s`,
    viewBox: '0 0 100 100',
  });

  svg.style(`
    .x-axis-group {
      animation: x-axis ${ORBIT_PERIOD}s ease-in-out infinite;
    }

    @keyframes x-axis {
      0% {
        transform: translate(-${ORBIT_RADIUS_X}%, 0)
      }
      50% {
        transform: translate(${ORBIT_RADIUS_X}%, 0)
      }
      100% {
        transform: translate(-${ORBIT_RADIUS_X}%, 0)
      }
    }

    .y-axis-group {
      animation: y-axis ${ORBIT_PERIOD}s ease-in-out infinite -${ORBIT_PERIOD_Y_OFFSET}s;
    }

    @keyframes y-axis {
      0% {
        transform: translate(0, -${ORBIT_RADIUS_Y}%)
      }
      50% {
        transform: translate(0, ${ORBIT_RADIUS_Y}%)
      }
      100% {
        transform: translate(0, -${ORBIT_RADIUS_Y}%)
      }
    }

    circle {
      animation: shape ${ORBIT_PERIOD}s ease-in-out infinite -${ORBIT_PERIOD_Y_OFFSET}s;
    }

    @keyframes shape {
      0% {
        transform: scale(${MIN_SCALE});
      }
      50% {
        transform: scale(1);
      }
      100% {
        transform: scale(${MIN_SCALE});
      }
    }
  `);

  const NUM_ORBITS = 10;
  const GAP = (100 - ORBIT_RADIUS_Y * 3) / (NUM_ORBITS - 1);
  const ORBIT_DELAY_GAP = ORBIT_PERIOD / 1 / NUM_ORBITS;

  range(NUM_ORBITS).forEach(index => {
    const yOffset = index * GAP + ORBIT_RADIUS_Y * 1.5;
    const delay = ORBIT_DELAY_GAP * index;

    const group = svg.g({
      transform: `translate(50, ${yOffset})`,
    });

    const xGroup = group.g({
      className: 'x-axis-group',
      style: { animationDelay: `-${delay}s` },
    });

    const yGroup = xGroup.g({
      className: 'y-axis-group',
      style: { animationDelay: `-${delay + ORBIT_PERIOD_Y_OFFSET}s` },
    });

    yGroup.circle({
      cx: 0,
      cy: 0,
      r: 2,
      style: { animationDelay: `-${delay + ORBIT_PERIOD_Y_OFFSET}s` },
    });
  });

  return svg;
};
