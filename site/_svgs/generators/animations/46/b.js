module.exports = require('./_make')({
  pathAttrs: ({ rowIndex, colIndex, num }) => ({
    style: {
      animationDirection:
        rowIndex % 2 === 0
          ? colIndex % 2 === 0
            ? 'reverse'
            : undefined
          : colIndex % 2 === 0
          ? undefined
          : 'reverse',
    },
  }),
});
