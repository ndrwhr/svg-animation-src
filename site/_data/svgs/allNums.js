const listGenerators = require('../../_helpers/listGenerators');
const renderSVG = require('../../_helpers/renderSVG');

module.exports = () => {
  const nums = listGenerators().reduce((acc, { num }) => {
    acc[num] = true;
    return acc;
  }, {});

  return Object.keys(nums).sort();
};
