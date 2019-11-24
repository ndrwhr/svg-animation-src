const range = require('lodash/range')
const { vec2 } = require('gl-matrix')

const SVG = require('../../utils/SVG')
const { createPoints } = require('../../utils/Polygon')

module.exports = id => {
  const numPoints = 6;
  const radius = 30;
  const points = createPoints(numPoints, radius);
  const animationDuration = 3;

  const svg = SVG.svg({
    id,
    dataAnimationDuration: `${animationDuration}s`,
    viewBox: '-50 -50 100 100',
  });

  const defs = svg.defs();

  defs
    .clipPath({
      id: 'moving-layers-group-clip-path',
    })
    .polygon({
      points: [vec2.create(), ...createPoints(numPoints, radius).slice(3)]
        .map(p => p.join(','))
        .join(' '),
    });

  defs.polygon({
    id: 'opaque-layer',
    points: [points[0], vec2.create(), points[points.length - 1]]
      .map(p => p.join(','))
      .join(' '),
  });

  const movingLayersGroup = defs.g({
    id: 'moving-layers-group',
    clipPath: 'url(#moving-layers-group-clip-path)',
  });

  movingLayersGroup.use({
    href: '#opaque-layer',
    transform: `translate(0, ${points[3][1]})`,
  });

  const movingLayerGroup = movingLayersGroup.g({
    className: 'moving-layer',
  });

  movingLayerGroup.use({
    href: '#opaque-layer',
    transform: `translate(0, ${(2 * points[3][1]) / 3})`,
  });

  movingLayerGroup.use({
    href: '#opaque-layer',
    transform: `translate(0, ${points[3][1] / 3})`,
  });

  movingLayerGroup.use({
    href: '#opaque-layer',
  });

  svg.style(`
    polyline,
    polygon {
      fill: none;
      stroke: black;
      stroke-width: 2;
    }

    line {
      stroke: black;
      stroke-width: 2;
    }

    #opaque-layer {
      stroke: black;
      stroke-width: 2;
      fill: white;
      stroke-linejoin: bevel;
    }

    .moving-layer {
      animation: moving-layer-anim ${animationDuration}s linear infinite;
    }

    @keyframes moving-layer-anim {
      to {
        transform: translateY(0);
      }
      from {
        transform: translateY(${points[3][1] / 3}%);
      }
    }
  `);

  range(3).forEach(index => {
    svg.use({
      href: '#moving-layers-group',
      transform: `rotate(${index * 120})`,
    });
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
