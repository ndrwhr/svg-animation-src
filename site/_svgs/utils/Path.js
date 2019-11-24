const { vec2 } = require('gl-matrix');

const { createPoints } = require('./Polygon');

const serializePolygonPoints = points => {
  return (
    points
      .map((p, index) => {
        const command = index === 0 ? 'M' : 'L';
        return `${command} ${p.join(',')}`;
      })
      .join(' ') + 'Z'
  );
};

const getControlPoints = (p0, p1, p2, curvature) => {
  const d01 = vec2.dist(p0, p1);
  const d12 = vec2.dist(p1, p2);

  const fa = (curvature * d01) / (d01 + d12);

  const c1 = vec2.subtract(vec2.create(), p2, p0);
  vec2.scale(c1, c1, fa);
  vec2.add(c1, p1, c1);

  const c2 = vec2.subtract(vec2.create(), p2, p0);
  vec2.scale(c2, c2, fa);
  vec2.subtract(c2, p1, c2);

  return [c1, c2];
};

const pointsToCurvedPathData = (points, curvature, wrapEnds = false) => {
  const serializePoint = p => p.join(',');
  const command = (C, ...args) => [C, ...args.map(serializePoint)].join(' ');

  const commands = [command('M', points[0])];
  const pointsToControlPointsMap = new Map();

  if (wrapEnds) {
    // Add control points for the first and last points. Because the ends share
    // the same point, we only have to calculate this once.
    const controlPoints = getControlPoints(
      points[points.length - 2],
      points[0],
      points[1],
      curvature,
    );

    pointsToControlPointsMap.set(points[0], controlPoints);
    pointsToControlPointsMap.set(points[points.length - 1], controlPoints);
  } else {
    pointsToControlPointsMap.set(points[0], [points[0], points[0]]);

    pointsToControlPointsMap.set(points[points.length - 1], [
      points[points.length - 1],
      points[points.length - 1],
    ]);
  }

  // Create all of the control points.
  for (let i = 1; i < points.length - 1; i++) {
    pointsToControlPointsMap.set(
      points[i],
      getControlPoints(points[i - 1], points[i], points[i + 1], curvature),
    );
  }

  // Add the first curve control point.
  (() => {
    const p0 = points[0];
    const p1 = points[1];
    const c1 = pointsToControlPointsMap.get(p0)[0];
    const c2 = pointsToControlPointsMap.get(p1)[1];
    commands.push(command('C', c1, c2, p1));
  })();

  points.slice(2, -1).forEach(point => {
    const [c1, c2] = pointsToControlPointsMap.get(point);
    commands.push(command('S', c2, point));
  });

  (() => {
    const point = points[points.length - 1];
    const [c1, c2] = pointsToControlPointsMap.get(point);
    commands.push(command('S', c2, point));
  })();

  return commands.join(' ');
};

const squarePath = ({
  size,
  center = vec2.create(),
  counterClockwise = false,
}) => {
  const points = [
    vec2.fromValues(1, -1),
    vec2.fromValues(1, 1),
    vec2.fromValues(-1, 1),
    vec2.fromValues(-1, -1),
  ]
    .map(p => vec2.scale(p, p, size / 2))
    .map(p => vec2.add(p, p, center));

  if (counterClockwise) points.reverse();

  return serializePolygonPoints(points);
};

const polygonPath = ({
  radius,
  numSides,
  center = vec2.create(),
  counterClockwise,
}) => {
  const points = createPoints(numSides, radius).map(p =>
    vec2.add(p, p, center),
  );

  if (counterClockwise) points.reverse();

  return serializePolygonPoints(points);
};

const circlePath = ({
  radius,
  center = vec2.create(),
  counterClockwise = false,
}) => {
  const [cx, cy] = center;
  const diameter = radius * 2;
  const sweepFlag = counterClockwise ? 0 : 1;

  const commands = [
    `M ${cx},${cx}`,
    `m -${radius},0`,
    `a ${radius},${radius} 0,1,${sweepFlag} ${diameter},0`,
    `a ${radius},${radius} 0,1,${sweepFlag} -${diameter},0`,
  ];

  return commands.join(' ');
};

module.exports = {
  pointsToCurvedPathData,
  squarePath,
  circlePath,
  polygonPath,
};
