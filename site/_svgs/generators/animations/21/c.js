const range = require('lodash/range');
const ease = require('eases/cubic-in-out');

const SVG = require('../../utils/SVG');

module.exports = () => {
  const DURATION = 5;
  const DEPTH = 9;
  const BASE_SIZE = 15;
  const NUM_FRAMES = 21;

  const [leftKeyframes, rightKeyframes] = range(NUM_FRAMES).reduce(
    ([left, right], i) => {
      const t = i / (NUM_FRAMES - 1);
      const p = t * 100;
      const v = ease(t);
      const angle = v * 45;
      const l = BASE_SIZE / (Math.cos((angle * Math.PI) / 180) * 2);
      const scale = l / BASE_SIZE;

      return [
        [
          ...left,
          `${p}% { transform: translate(0, -${BASE_SIZE}%) rotate(${-angle}deg) scale(${scale}) }`,
        ],
        [
          ...right,
          `${p}% { transform: translate(0, -${BASE_SIZE}%) rotate(${angle}deg) scale(${scale}) }`,
        ],
      ];
    },
    [[], []],
  );

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `-50 -50 100 100`,
  });

  svg.style(`
    rect {
      fill: black;
      stroke: none;
    }

    .left-parent {
      transform-origin: ${-BASE_SIZE / 2}% ${BASE_SIZE / 2}%;
      animation: left-anim ${DURATION}s linear infinite alternate -${DURATION}s;
    }

    .right-parent {
      transform-origin: ${BASE_SIZE / 2}% ${BASE_SIZE / 2}%;
      animation: right-anim ${DURATION}s linear infinite alternate -${DURATION}s;
    }

    @keyframes left-anim {
      ${leftKeyframes.join('\n')}
    }

    @keyframes right-anim {
      ${rightKeyframes.join('\n')}
    }
  `);

  const recurse = (depth, parent) => {
    if (depth === 0) return;

    const leftParent = parent.g({
      className: 'left-parent',
    });

    leftParent.rect({
      x: -BASE_SIZE / 2,
      y: -BASE_SIZE / 2,
      width: BASE_SIZE,
      height: BASE_SIZE,
    });

    const rightParent = parent.g({
      className: 'right-parent',
    });

    rightParent.rect({
      x: -BASE_SIZE / 2,
      y: -BASE_SIZE / 2,
      width: BASE_SIZE,
      height: BASE_SIZE,
    });

    recurse(depth - 1, leftParent);
    recurse(depth - 1, rightParent);
  };

  const baseGroup = svg.g({
    transform: `translate(0, ${BASE_SIZE})`,
  });

  baseGroup.rect({
    x: -BASE_SIZE / 2,
    y: -BASE_SIZE / 2,
    height: BASE_SIZE,
    width: BASE_SIZE,
  });

  recurse(DEPTH, baseGroup);

  return svg;
};
