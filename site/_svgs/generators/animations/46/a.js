const seedrandom = require('seedrandom');

const rand = seedrandom(47);

const getAngle = () => {
  const angles = [0, 90, 180, 270];
  return angles[Math.floor(rand() * angles.length)];
};

module.exports = require('./_make')({
  gAttrs: ({ rowIndex, colIndex, num }) => ({
    transform: `rotate(${getAngle()})`,
  }),
  pathAttrs: () => ({
    style: {
      animationDirection: Math.round(rand()) ? 'reverse' : undefined,
    },
  }),
});
