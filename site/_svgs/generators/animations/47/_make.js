const { vec2 } = require('gl-matrix');
const merge = require('lodash/merge');
const SVG = require('../../utils/SVG');

module.exports = ({ n, timeOffset = () => 0 }) => () => {
  const R = 40;
  const DURATION = 3;

  const svg = SVG.svg({
    dataAnimationDuration: `${DURATION}s`,
    viewBox: '-50 -50 100 100',
  });

  svg.style(`
    polygon {
      fill: black;
      stroke: none;
      animation: anim ${DURATION}s ease-in-out infinite alternate;
      transform: scaleY(-0.5);
    }

    @keyframes anim {
      from {
        transform: scaleY(1);
      }
      to {
        transform: scaleY(-0.25);
      }
    }
  `);

  const angleOffset = (2 * Math.PI) / n;
  const o = vec2.create();
  const v = vec2.fromValues(0, -R);
  const p1 = vec2.rotate(vec2.create(), v, o, -angleOffset / 2);
  const p2 = vec2.rotate(vec2.create(), v, o, angleOffset / 2);
  const center = vec2.lerp(vec2.create(), p1, p2, 0.5);

  for (let i = 0; i < n; i++) {
    svg
      .g({
        transform: `rotate(${(i * angleOffset * 180) / Math.PI})`,
      })
      .polygon({
        points: [o, p1, p2],
        style: {
          transformOrigin: Array.from(center)
            .map(v => `${v}%`)
            .join(' '),
          animationDelay: `${-timeOffset(i) * DURATION}s`,
        },
      });
  }

  return svg;
};
