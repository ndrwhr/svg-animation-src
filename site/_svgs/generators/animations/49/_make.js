const range = require('lodash/range');
const { vec2 } = require('gl-matrix');
const SVG = require('../../utils/SVG');

module.exports = ({
  alternate,
  angleDelta,
  baseAngles,
  n,
  path,
  drawAxis,
}) => () => {
  const END_SCALE = 0.3;
  const THICKNESS = 0.15;
  const DURATION = angleDelta / 35;

  const [start, end] = path;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    line {
      stroke: black;
      stroke-width: ${THICKNESS};
    }

    circle {
      fill: white;
      stroke: black;
      stroke-width: ${THICKNESS};
    }

    .animated-group {
      animation: anim ${DURATION}s ease-in-out infinite alternate;
    }

    ${
      alternate
        ? `
        g:nth-child(even) .animated-group {
          animation-direction: alternate-reverse;
        }
        `
        : ''
    }

    @keyframes anim {
      from {
        transform: rotate(${angleDelta / 2}deg);
      }

      to {
        transform: rotate(${-angleDelta / 2}deg);
      }
    }
  `);

  const defs = svg.defs();
  const defGroup = defs.g({
    id: 'main-shape',
  });
  defGroup.line({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: -40,
  });
  defGroup.circle({
    cx: 0,
    cy: -40,
    r: 2.5,
  });

  if (drawAxis) {
    svg.polygon({
      points: [
        [
          start[0] - (END_SCALE * THICKNESS) / 2,
          start[1] - (END_SCALE * THICKNESS) / 2,
        ],
        [
          start[0] + (END_SCALE * THICKNESS) / 2,
          start[1] - (END_SCALE * THICKNESS) / 2,
        ],
        [end[0] + THICKNESS / 2, end[1] + THICKNESS / 2],
        [end[0] - THICKNESS / 2, end[1] + THICKNESS / 2],
      ],
    });
  }

  range(n).forEach(i => {
    baseAngles.forEach(angle => {
      const t = i / (n - 1);
      const p = vec2.lerp(vec2.create(), start, end, i / (n - 1));

      const offset = Array.from(p).join(' ');
      const transform = [
        `translate(${offset})`,
        `scale(${t * (1 - END_SCALE) + END_SCALE})`,
      ].join(' ');
      svg
        .g({
          transform,
        })
        .g({
          className: 'animated-group',
          style: {
            animationDelay: `-${DURATION * t}s`,
          },
        })
        .use({
          href: '#main-shape',
          transform: `rotate(${angle})`,
        });
    });
  });

  return svg;
};
