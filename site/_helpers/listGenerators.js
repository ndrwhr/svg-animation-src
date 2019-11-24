const glob = require('glob');
const { GENERATOR_DIR } = require('./paths');

module.exports = () =>
  glob.sync(`${GENERATOR_DIR}/**/*.js`).map(paths => {
    const [, num, variation] = /(\d\d)\/(\w)\.js/.exec(paths);
    return { num, variation };
  });
