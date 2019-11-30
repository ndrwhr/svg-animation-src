const { MISC_DIR } = require('./paths');

module.exports = function({ name }) {
  const modulePath = require.resolve(`${MISC_DIR}/${name}.js`);
  delete require.cache[modulePath];
  const svg = require(modulePath)(name);
  const text = svg.render({
    addNamespace: true,
  });

  return text;
};
