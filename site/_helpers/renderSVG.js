const { GENERATOR_DIR } = require('./paths');

const svgCache = {};

const render = ({ num, variation }) => {
  const modulePath = require.resolve(`${GENERATOR_DIR}/${num}/${variation}.js`);
  delete require.cache[modulePath];
  const svg = require(modulePath)(`${num}-${variation}`);
  const text = svg.render({
    addNamespace: true,
  });

  return text;
};

module.exports = function({ num, variation }) {
  if (!svgCache[num]) svgCache[num] = {};

  const variationCache = svgCache[num];
  if (!variationCache[variation])
    variationCache[variation] = render({ num, variation });

  return variationCache[variation];
};
