const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')

module.exports = () => {
  const DURATION = 1.5;
  const NUM_LINES = 100;
  const SIZE = 70;
  const ANGLE_STEP = 360 / NUM_LINES;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  const defs = svg.defs();
  defs
    .clipPath({
      id: 'tr',
    })
    .rect({
      x: 0,
      y: -SIZE / 2,
      height: SIZE / 2,
      width: SIZE / 2,
    });

  defs
    .clipPath({
      id: 'tl',
    })
    .rect({
      x: -SIZE / 2,
      y: -SIZE / 2,
      height: SIZE / 2,
      width: SIZE / 2,
    });

  defs
    .clipPath({
      id: 'br',
    })
    .rect({
      x: 0,
      y: 0,
      height: SIZE / 2,
      width: SIZE / 2,
    });

  defs
    .clipPath({
      id: 'bl',
    })
    .rect({
      x: -SIZE / 2,
      y: 0,
      height: SIZE / 2,
      width: SIZE / 2,
    });

  svg.style(`
    .line-group {
      animation: line-group-anim ${DURATION}s linear infinite;
    }

    .line-group line {
      stroke: black;
      stroke-width: 0.2;
    }

    @keyframes line-group-anim {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(${ANGLE_STEP}deg);
      }
    }
  `);

  const makePattern = attrs => {
    const group = svg.g(
      Object.assign(
        {
          className: 'line-group',
        },
        attrs,
      ),
    );
    range(NUM_LINES).forEach(i => {
      group.line({
        transform: `rotate(${ANGLE_STEP * i})`,
        x1: 0,
        y1: 0,
        x2: 150,
        y2: 0,
      });
    });
    return group;
  };

  svg.g(
    {
      clipPath: `url(#tr)`,
      transform: `translate(-${SIZE / 2}, 0)`,
    },
    svg.g(
      {
        transform: `translate(${SIZE * 0.6}, 0)`,
      },
      makePattern({ style: { animationDirection: 'reverse' } }),
    ),
    svg.g(
      {
        transform: `translate(-${SIZE * 0.6}, 0)`,
      },
      makePattern(),
    ),
  );

  svg.g(
    {
      clipPath: `url(#tl)`,
      transform: `translate(${SIZE / 2}, 0)`,
    },
    svg.g(
      {
        transform: `translate(${SIZE * 0.6}, 0)`,
      },
      makePattern({ style: { animationDirection: 'reverse' } }),
    ),
    svg.g(
      {
        transform: `translate(-${SIZE * 0.6}, 0)`,
      },
      makePattern(),
    ),
  );

  svg.g(
    {
      clipPath: `url(#br)`,
      transform: `translate(-${SIZE / 2}, 0)`,
    },
    svg.g(
      {
        transform: `translate(${SIZE * 0.6}, 0)`,
      },
      makePattern(),
    ),
    svg.g(
      {
        transform: `translate(-${SIZE * 0.6}, 0)`,
      },
      makePattern({ style: { animationDirection: 'reverse' } }),
    ),
  );

  svg.g(
    {
      clipPath: `url(#bl)`,
      transform: `translate(${SIZE / 2}, 0)`,
    },
    svg.g(
      {
        transform: `translate(${SIZE * 0.6}, 0)`,
      },
      makePattern(),
    ),
    svg.g(
      {
        transform: `translate(-${SIZE * 0.6}, 0)`,
      },
      makePattern({ style: { animationDirection: 'reverse' } }),
    ),
  );

  return svg;
};
