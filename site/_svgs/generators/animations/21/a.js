const range = require('lodash/range');

const SVG = require('../../utils/SVG');

module.exports = () => {
  const DURATION = 5;
  const ITERATIONS = 7;
  const STROKE_DECAY = 1.2;
  const LENGTH_DECAY = Math.sqrt(2);
  const TOTAL_LENGTH = 45;

  const START_LENGTH =
    TOTAL_LENGTH /
    range(ITERATIONS).reduce(
      (sum, i) => sum + 1 / Math.pow(LENGTH_DECAY, i),
      0,
    );

  const START_WIDTH = 1;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `-50 -50 100 100`,
  });

  svg.style(`
    line {
      stroke: black;
    }

    .segment {
      animation: 5s ease-in-out infinite alternate;
    }

    .segment--right {
      transform: rotate(30deg);
      animation-name: right-anim;
    }

    .segment--left {
      transform: rotate(-30deg);
      animation-name: left-anim;
    }

    @keyframes right-anim {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(90deg);
      }
    }

    @keyframes left-anim {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(-90deg);
      }
    }
  `);

  const makeSegment = ({ parent, length, strokeWidth, side, depth }) => {
    if (depth === 0) return;

    const group = parent.g({
      className: `segment segment--${side}`,
    });

    group.line({
      x1: 0,
      y1: 0,
      x2: length,
      y2: 0,
      strokeWidth,
    });

    const nextParent = group.g({
      transform: `translate(${length}, 0)`,
    });

    makeSegment({
      parent: nextParent,
      length: length / LENGTH_DECAY,
      strokeWidth: strokeWidth / STROKE_DECAY,
      side: 'right',
      depth: depth - 1,
    });

    makeSegment({
      parent: nextParent,
      length: length / LENGTH_DECAY,
      strokeWidth: strokeWidth / STROKE_DECAY,
      side: 'left',
      depth: depth - 1,
    });
  };

  const STEM_LENGTH = START_LENGTH * LENGTH_DECAY;
  const mainParent = svg.g({
    className: 'main-parent',
    transform: `rotate(-90) translate(-${STEM_LENGTH + TOTAL_LENGTH - 50}, 0)`,
  });

  makeSegment({
    parent: mainParent,
    length: START_LENGTH,
    strokeWidth: START_WIDTH,
    side: 'right',
    depth: ITERATIONS,
  });

  makeSegment({
    parent: mainParent,
    length: START_LENGTH,
    strokeWidth: START_WIDTH,
    side: 'left',
    depth: ITERATIONS,
  });

  mainParent.line({
    x1: 0,
    y1: 0,
    x2: -STEM_LENGTH,
    y2: 0,
    strokeWidth: START_WIDTH * STROKE_DECAY,
  });

  return svg;
};
