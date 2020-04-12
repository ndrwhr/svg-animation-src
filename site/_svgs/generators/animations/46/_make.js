const merge = require('lodash/merge');
const range = require('lodash/range');
const SVG = require('../../utils/SVG');
const ease = require('eases/quint-in-out');

const getAnimationSteps = () => {
  const stepsPerRange = 50;
  const ranges = [
    [0, 90],
    [90, 180],
    [180, 270],
    [270, 360],
  ];

  const angles = ranges.reduce((acc, [start, end]) => {
    range(0, stepsPerRange + 1).forEach(i => {
      const t = i / stepsPerRange;
      const v = (end - start) * ease(t) + start;
      acc.push(v);
    });
    return acc;
  }, []);

  return angles
    .map(
      (angle, i) => `
    ${(100 * i) / (angles.length - 1)}% {
      transform: rotate(${angle}deg);
    }
  `,
    )
    .join('\n');
};

module.exports = ({ gAttrs = () => ({}), pathAttrs = () => ({}) }) => {
  const actualModule = () => {
    const PADDING = 5;
    const GAP = 1;
    const NUM = 8;
    const DURATION = 5;

    const r = (100 - (PADDING * 2 + GAP * (NUM - 1))) / (2 * NUM);

    const svg = SVG.svg({
      dataAnimationDuration: `${DURATION}s`,
      viewBox: '0 0 100 100',
    });

    svg.style(`
      path {
        fill: black;
        stroke: none;
        animation: anim ${DURATION}s linear infinite;
      }

      @keyframes anim {
        ${getAnimationSteps()}
      }
    `);

    let x = PADDING + r;
    let y = PADDING + r;
    for (let i = 0; i < NUM; i++) {
      for (let j = 0; j < NUM; j++) {
        svg
          .g({ transform: `translate(${x}, ${y})` })
          .g(gAttrs({ rowIndex: i, colIndex: j, num: NUM }))
          .path(
            merge(
              {
                d: `M ${r} 0 A ${-r} ${-r}, 0, 1, 1, 0 ${-r} l 0 ${r} Z`,
              },
              pathAttrs({ rowIndex: i, colIndex: j, num: NUM }),
            ),
          );
        x += GAP + r * 2;
      }
      x = PADDING + r;
      y += GAP + r * 2;
    }

    return svg;
  };

  actualModule.attribution =
    'Based on [sketch-001.js](https://github.com/amiechen/genart) by [Amie Chen](https://twitter.com/hyper_yolo).';

  return actualModule;
};
