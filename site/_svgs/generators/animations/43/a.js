const SVG = require('../../utils/SVG');

const make = scales => {
  const DURATION = 3;
  const HEIGHT = 90;
  const WIDTH = 45;
  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION * 2}s`,
    viewBox: '-50 -50 100 100',
  });

  svg
    .defs()
    .clipPath({
      id: 'main-clip',
    })
    .circle({
      r: WIDTH,
    });

  const TIMING_OFFSET = 0.6;
  const TIMING_FUNCTION = `cubic-bezier(${TIMING_OFFSET}, 0, ${1 -
    TIMING_OFFSET}, 1)`;

  const style = svg.style(`
    rect {
      fill: black;
      animation: main-anim ${DURATION}s ${TIMING_FUNCTION} infinite alternate;
    }

    @keyframes main-anim {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(-45deg);
      }
    }
  `);

  const mainGroup = svg.g({
    clipPath: 'url(#main-clip)',
  });

  scales.forEach(([sx, sy]) => {
    mainGroup
      .g({
        transform: `scale(${sx}, ${sy})`,
      })
      .g({
        transform: `translate(0, ${-HEIGHT / 2})`,
      })
      .rect({
        x: 0,
        y: 0,
        width: WIDTH,
        height: HEIGHT,
      });
  });

  return svg;
};

module.exports = () =>
  make([
    [1, 1],
    [-1, 1],
  ]);
module.exports.make = make;
