const range = require('lodash/range');

module.exports = require('./_make')({
  R: 10,
  delayFnGenerator: ({ N }) => {
    const toIndex = (r, c) => r * N + c;
    const grid = range(N).reduce((acc, r) => {
      const row = [];
      range(N).forEach(c => {
        row.push(toIndex(r, c));
      });

      acc.push(row);
      return acc;
    }, []);

    const layers = [];
    for (let i = 0; i < N / 2; i++) {
      const layer = [];

      layer.push(...grid[i].slice(i, N - i));

      for (let j = i + 1; j < N - 1 - i; j++) {
        layer.push(grid[j][i], grid[j][N - 1 - i]);
      }

      layer.push(...grid[N - 1 - i].slice(i, N - i));

      layers.push(layer);
    }

    const indexToLayer = {};

    layers.forEach((layer, layerIndex) => {
      layer.forEach(index => {
        indexToLayer[index] = layerIndex;
      });
    });

    return ({ x, y, r, c }) =>
      indexToLayer[toIndex(r, c)] / (layers.length - 1);
  },
});
