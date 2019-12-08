module.exports = require('./_make')({
  gAttrs: ({ rowIndex, colIndex, num }) => ({
    transform: `rotate(${(180 * (rowIndex * num + colIndex)) / (num * num)})`,
  }),
  // pathAttrs: () => ({
  //   style: {
  //     animationDirection: Math.round(rand()) ? 'reverse' : undefined,
  //   },
  // }),
});
