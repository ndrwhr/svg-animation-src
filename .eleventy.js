const CleanCSS = require('clean-css');
const htmlmin = require('html-minifier');
const markdownIt = require('markdown-it');
const markdownItSup = require('markdown-it-sup');

const markdownLib = markdownIt({
  html: true,
})
  .use(markdownItSup)
  .disable('code');

const columnLookup = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 3,
  6: 3,
  7: 4,
  8: 4,
  9: 3,
  10: 4,
  11: 4,
  12: 4,
  13: 4,
  14: 4,
  15: 4,
};

module.exports = function(eleventyConfig) {
  module.exports = function(eleventyConfig) {
    eleventyConfig.addWatchTarget('./site/_svg/');
  };

  eleventyConfig.addFilter('numColumns', numItems => {
    return columnLookup[numItems];
  });

  eleventyConfig.addPassthroughCopy('site/assets');

  eleventyConfig.addFilter('cssmin', function(code) {
    return new CleanCSS({ level: 2 }).minify(code).styles;
  });

  eleventyConfig.addFilter('markdownInline', function(str) {
    return markdownLib.renderInline(str);
  });

  eleventyConfig.addTransform('htmlmin', function(content, outputPath) {
    if (outputPath.endsWith('.html')) {
      const minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.setLibrary('md', markdownLib);

  return {
    dir: {
      input: 'site',
      output: 'dist',
    },
  };
};
