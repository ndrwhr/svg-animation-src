const glob = require('glob');
const { MISC_DIR } = require('./paths');

module.exports = () =>
  glob.sync(`${MISC_DIR}/*.js`).map(paths => {
    const [, name] = /(\w+)\.js/.exec(paths);
    return { name };
  });
