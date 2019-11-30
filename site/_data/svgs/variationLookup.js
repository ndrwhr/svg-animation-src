const listGenerators = require('../../_helpers/listGenerators');

module.exports = () => {
  return listGenerators().reduce((acc, { num, variation }) => {
    acc[num] = [...(acc[num] || []), variation];
    return acc;
  }, {});
};
