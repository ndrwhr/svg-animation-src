const glob = require('glob');
const path = require('path');
const markdownIt = require('markdown-it');
const mila = require('markdown-it-link-attributes');

const markdownLib = markdownIt({
  html: true,
});

markdownLib.use(mila, {
  attrs: {
    target: '_blank',
    rel: 'noopener',
  },
});

const ROOT = process.cwd();
const GENERATORS_DIR = path.join(ROOT, 'site/_svgs/generators');

const listGenerators = dir => glob.sync(`${GENERATORS_DIR}/${dir}/**/*.js`);
const getHomeUrl = dirName => {
  const page = Math.ceil(parseInt(dirName, 10) / 10);
  return page === 1 ? `/#${dirName}` : `/page-${page}/#${dirName}`;
};

const generateCommonData = generatorPath => {
  const modulePath = require.resolve(generatorPath);
  delete require.cache[modulePath];
  const generator = require(modulePath);

  const [, dirName, fileName] = /([\d\w]+)\/(\w+)\.js$/.exec(generatorPath);
  const id = `${dirName}-${fileName}`;
  const svg = generator(id);

  svg.title(`Animation ${dirName} - Variation ${fileName}`.toUpperCase());

  const descContent = [];
  if (generator.desc) {
    descContent.push(generator.desc);
  }

  descContent.push(
    'Created by [Andrew Wang-Hoyer](http://andrew.wang-hoyer.com).',
  );

  if (generator.attribution) {
    descContent.push(generator.attribution);
  }

  svg.desc(markdownLib.render(descContent.join('\n\n')));

  return {
    id,
    dirName,
    fileName,
    desc: generator.desc ? markdownLib.render(generator.desc) : undefined,
    attribution: generator.attribution
      ? markdownLib.renderInline(generator.attribution)
      : undefined,
    homeUrl: getHomeUrl(dirName),
    url: `/${dirName}/${fileName}/`,
    svgUrl: `/${dirName}/${fileName}.svg`,
    rawXML: svg.render({
      namespace: `svg-${id}`,
    }),
    minXML: svg.render({
      namespace: `svg-${id}`,
      minify: true,
    }),
  };
};

const getAnimations = () => {
  const list = listGenerators('animations')
    // .filter(path => path.includes('47/'))
    .filter(path => /\/\w.js/.test(path))
    .map(generateCommonData)
    .sort((a, b) => a.id.localeCompare(b.id));
  const dirs = {};

  list.forEach((data, index) => {
    const { dirName } = data;

    if (list[index - 1]) {
      data.previous = list[index - 1];
    }

    if (list[index + 1]) {
      data.next = list[index + 1];
    }

    dirs[dirName] = dirs[dirName] || {
      name: dirName,
      homeUrl: getHomeUrl(dirName),
      list: [],
      url: `/${dirName}/`,
    };
    dirs[dirName].list.push(data);
  });

  const dirArr = Object.keys(dirs)
    .sort()
    .map(key => dirs[key])
    .map((dir, index, allDirs) =>
      Object.assign(
        {
          index,
          previous: allDirs[index - 1] ? allDirs[index - 1] : null,
          next: allDirs[index + 1] ? allDirs[index + 1] : null,
        },
        dir,
      ),
    );

  list.forEach(data => {
    data.dir = dirArr.find(({ name }) => data.dirName === name);
  });

  return {
    list,
    dirs: dirArr,
  };
};

const getMisc = () =>
  listGenerators('misc')
    .map(generateCommonData)
    .reduce((acc, data) => Object.assign(acc, { [data.fileName]: data }), {});

module.exports = () => {
  const animations = getAnimations();
  const misc = getMisc();

  const attributionMap = {};
  animations.list.forEach(svg => {
    const { dirName, attribution } = svg;

    if (attribution) {
      if (!attributionMap[attribution]) {
        attributionMap[attribution] = {};
      }

      if (!attributionMap[attribution][dirName]) {
        attributionMap[attribution][dirName] = [];
      }

      attributionMap[attribution][dirName].push(svg);
    }
  });

  return {
    animations,
    misc,
    attributionMap,
  };
};
