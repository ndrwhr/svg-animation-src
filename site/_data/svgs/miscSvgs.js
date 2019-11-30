const listMisc = require('../../_helpers/listMisc');
const renderMiscSVG = require('../../_helpers/renderMiscSVG');

module.exports = () => {
  const svgs = listMisc().reduce((acc, { name }) => {
    acc[name] = {
      xml: renderMiscSVG({ name }),
    };
    return acc;
  }, {});

  return svgs;
};
