const listGenerators = require('../../_helpers/listGenerators');
const renderSVG = require('../../_helpers/renderSVG');

module.exports = () => {
  return listGenerators().reduce((acc, { num, variation }) => {
    acc[num] = [...(acc[num] || []), variation];
    return acc;
  }, {});
};
