const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { createPoints } = require('../../utils/Polygon')

module.exports = () => {
  const points = createPoints(6, 30);
  const animationDuration = 2;

  const start = vec2.scale(vec2.create(), points[4], 0.5);
  const end = vec2.scale(vec2.create(), points[1], 0.5);

  const numLayers = 4;

  const animationEnd = vec2.lerp(vec2.create(), start, end, 1 / numLayers);

  const svg = SVG.svg({
    dataAnimationDuration: `${animationDuration}s`,
    viewBox: '-50 -50 100 100',
  });

  const defs = svg.defs();

  defs.rect({
    id: 'layer',
    x: -5,
    y: -5,
    width: 10,
    height: 10,
    transform: 'skewY(30)',
  });

  svg.style(`
    polygon {
      fill: none;
      stroke: black;
      stroke-width: 2;
    }

    line {
      stroke: black;
      stroke-width: 2;
    }

    #layer {
      stroke: black;
      stroke-width: 2;
      fill: white;
    }

    .moving-layers {
      animation: moving-layers-anim ${animationDuration}s linear infinite;
    }

    @keyframes moving-layers-anim {
      to {
        transform: translate(0, 0);
      }

      from {
        transform: translate(${animationEnd[0]}%, ${animationEnd[1]}%);
      }
    }
  `);

  [0, 2, 4].forEach(index => {
    svg.line({
      x1: 0,
      y1: 0,
      x2: points[index][0],
      y2: points[index][1],
    });
  });

  svg.use({
    href: '#layer',
    transform: `translate(${end[0]}, ${end[1]})`,
  });

  const g = svg.g({
    className: 'moving-layers',
  });
  range(numLayers).forEach(index => {
    const position = vec2.lerp(vec2.create(), end, start, index / numLayers);
    g.use({
      href: '#layer',
      transform: `translate(${position[0]}, ${position[1]})`,
    });
  });

  svg.use({
    href: '#layer',
    transform: `translate(${start[0]}, ${start[1]})`,
  });

  [1, 3, 5].forEach(index => {
    svg.line({
      x1: 0,
      y1: 0,
      x2: points[index][0],
      y2: points[index][1],
    });
  });

  svg.polygon({
    points: points.map(p => p.join(',')).join(' '),
  });

  return svg;
};
