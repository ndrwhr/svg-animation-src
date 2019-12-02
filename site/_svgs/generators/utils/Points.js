const { vec2 } = require('gl-matrix')

module.exports.centerAndScalePoints = (points, { maxSize = 100 }) => {
  // Calculate the bounding rectangle.
  const { min, max } = points.reduce(
    ({ min, max }, point) => ({
      min: vec2.min(vec2.create(), min, point),
      max: vec2.max(vec2.create(), max, point),
    }),
    {
      min: vec2.fromValues(Infinity, Infinity),
      max: vec2.fromValues(-Infinity, -Infinity),
    },
  );
  const dimensions = vec2.subtract(vec2.create(), max, min);
  const center = vec2.subtract(
    vec2.create(),
    max,
    vec2.scale(vec2.create(), dimensions, 0.5),
  );

  const scaleFactor =
    dimensions[1] > dimensions[0]
      ? maxSize / dimensions[1]
      : maxSize / dimensions[0];

  return points.map(point =>
    vec2.scale(
      vec2.create(),
      vec2.subtract(vec2.create(), point, center),
      scaleFactor,
    ),
  );
};
