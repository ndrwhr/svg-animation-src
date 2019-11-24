const listGenerators = require('../../_helpers/listGenerators');
const renderSVG = require('../../_helpers/renderSVG');

module.exports = () => {
  const groups = listGenerators().reduce((acc, { num, variation }) => {
    acc[num] = [...(acc[num] || []), variation];
    return acc;
  }, {});

  const groupedByNum = Object.keys(groups)
    .sort()
    .map(num => {
      return {
        num,
        variations: groups[num],
      };
    });

  return groupedByNum;
};
