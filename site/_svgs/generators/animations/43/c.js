const { make } = require('./a')

module.exports = id => make(id, [[1, 1], [-1, 1], [1, -1], [-1, -1]]);
