const { vec2 } = require('gl-matrix');
const merge = require('lodash/merge');
const range = require('lodash/range');
const shuffle = require('lodash/shuffle');
const random = require('lodash/random');
const SVG = require('../../utils/SVG');
const ease = require('eases/elastic-out');
const seedrandom = require('seedrandom');

const getAnimationSteps = points => {
  const stepsPerRange = Math.ceil(50 / points.length);

  const steps = points.reduce((acc, p1, index) => {
    const p2 = index === points.length - 1 ? points[0] : points[index + 1];

    range(0, stepsPerRange + 1).forEach(i => {
      const t = i / stepsPerRange;
      const v = vec2.lerp(vec2.create(), p1, p2, ease(t));
      acc.push(v);
    });
    return acc;
  }, []);

  return steps
    .map(
      (p, i) => `
        ${(100 * i) / (steps.length - 1)}% {
          transform: translate(${Array.from(p)
            .map(v => `${v}%`)
            .join(', ')});
        }
      `,
    )
    .join('\n');
};

module.exports = ({ paths, pathNumber, extraAttrs = () => ({}) }) => () => {
  const oldRandom = Math.random;
  Math.random = seedrandom(32);

  const PADDING = 15;
  const R = 1.5;
  const NUM = 10;
  const DURATION = 7;

  const gap = (100 - PADDING * 2) / (NUM - 1);

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '0 0 100 100',
  });

  const animations = paths
    .map(points => points.map(p => vec2.scale(vec2.create(), p, gap)))
    .map((points, i) => `@keyframes anim-${i} {${getAnimationSteps(points)}}`);

  svg.style(`
    circle {
      fill: black;
      stroke: none;
      animation: anim-0 ${DURATION}s linear infinite;
    }

    ${animations
      .map((_, i) => `.anim-${i} { animation-name: anim-${i} }`)
      .join('\n')}

    ${animations.join('\n')}
  `);

  let x = PADDING;
  let y = PADDING;
  for (let i = 0; i < NUM; i++) {
    for (let j = 0; j < NUM; j++) {
      svg.circle(
        merge(
          {
            cx: x,
            cy: y,
            r: R,
            className: 'anim-' + pathNumber({ i, j, n: NUM }),
          },
          extraAttrs({ i, j, n: NUM, duration: DURATION }),
        ),
      );
      x += gap;
    }
    x = PADDING;
    y += gap;
  }

  // Restore Math.random.
  Math.random = oldRandom;

  return svg;
};
