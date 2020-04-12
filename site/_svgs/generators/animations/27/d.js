const classNames = require('classnames');
const eases = require('eases');
const range = require('lodash/range');

const SVG = require('../../utils/SVG');
const { pointsToCurvedPathData } = require('../../utils/Path');
const { createPoints } = require('../../utils/Polygon');

module.exports = () => {
  const NUM_SIDES = 3;
  const MAX_RADIUS = 20;
  const END_OFFSET = MAX_RADIUS * 1;
  const NUM_SHAPES = 10;
  const DURATION = 1;
  const END_ROTATION = 60;

  const points = createPoints(NUM_SIDES, MAX_RADIUS);

  const ROTATION_STEP = END_ROTATION / (NUM_SHAPES - 1);
  const MOVE_STEP = END_OFFSET / (NUM_SHAPES - 1);

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: `-50 -50 100 100`,
  });

  svg.style(`
    polygon {
      stroke: black;
      stroke-width: 0.1;
      fill: white;
    }

    .animation-parent {
      animation: main-anim ${DURATION}s linear infinite;
    }

    @keyframes main-anim {
      from {
        transform: translate(0, 0) rotate(0);
      }
      to {
        transform: translate(${MOVE_STEP}%, 0) rotate(${ROTATION_STEP}deg);
      }
    }

  `);

  const internalAngle = 180 / NUM_SIDES;
  const angles = range(NUM_SIDES).map(i => i * 2 * internalAngle);

  range(NUM_SHAPES)
    .reverse()
    .forEach(index => {
      const shouldBeAnimated = index !== NUM_SHAPES - 1;
      const v = eases.linear(index / (NUM_SHAPES - 1));
      const x = v * END_OFFSET;
      const rotation = v * END_ROTATION;

      angles.forEach(deg => {
        svg
          .g({
            transform: `rotate(${deg}) translate(${x}, 0)`,
          })
          .g({
            className: classNames({
              'animation-parent': shouldBeAnimated,
            }),
          })
          .polygon({
            points,
            transform: `rotate(${rotation})`,
          });
      });
    });

  svg.polygon({
    points,
  });

  return svg;
};
