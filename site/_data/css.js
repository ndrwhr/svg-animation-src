const glob = require('glob');

module.exports = () =>
  glob
    .sync(`site/_includes/css/**/*.css`)
    .map(path => /(css\/\w+\.css)$/.exec(path)[1]);
