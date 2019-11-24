const listGenerators = require('../../_helpers/listGenerators');
const renderSVG = require('../../_helpers/renderSVG');

module.exports = () => {
  const svgs = listGenerators().reduce((acc, { num, variation }) => {
    acc[num] = acc[num] || {};
    acc[num][variation] = {
      xml: renderSVG({ num, variation }),
    };

    return acc;
  }, {});
  return svgs;
};
