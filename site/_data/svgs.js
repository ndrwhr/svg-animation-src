const fs = require('fs');
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

const DOMAIN = 'https://andrew.wang-hoyer.com';
const EXP_PATH = 'experiments/svg-animations';
const GITHUB_URL = 'https://github.com/ndrwhr/svg-animation-src/tree/master';

const ROOT = process.cwd();
const GENERATORS_DIR = path.join(ROOT, 'site', '_svgs', 'generators');

const LICENSE_LINES = fs
  .readFileSync(path.join(ROOT, 'LICENSE'), 'utf-8')
  .trim()
  .split('\n')
  .reduce(
    (acc, line) => {
      if (line.length) {
        acc[acc.length - 1] = `${acc[acc.length - 1]} ${line}`;
      } else {
        acc.push('');
      }
      return acc;
    },
    [''],
  )
  .filter(line => line.length);

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
  const title = `Animation ${dirName} - Variation ${fileName}`.toUpperCase();

  svg.title(title);

  const descContent = [];
  if (generator.desc) {
    descContent.push(generator.desc);
  }

  if (generator.attribution) {
    descContent.push(generator.attribution);
  }

  const absoluteUrl = `${DOMAIN}/${EXP_PATH}/${dirName}/${fileName}`;
  descContent.push(
    `See this animation in action here: [${absoluteUrl}](${absoluteUrl}).`,
  );

  const sourceUrl = `${GITHUB_URL}/site/_svgs/generators/animations/${dirName}/${fileName}.js`;
  descContent.push(`Generator source code : [${sourceUrl}](${sourceUrl}).`);

  descContent.push(
    `All generated files and source code are released under the following license:`,
    ...LICENSE_LINES,
  );

  svg.desc(markdownLib.render(descContent.join('\n\n')));

  const minXML = svg.render({
    namespace: `svg-${id}`,
    minify: true,
  });

  const rawXML = svg.render({
    namespace: `svg-${id}`,
  });

  return {
    id,
    title,
    dirName,
    fileName,
    sourceUrl,
    desc: generator.desc ? markdownLib.render(generator.desc) : undefined,
    attribution: generator.attribution
      ? markdownLib.renderInline(generator.attribution)
      : undefined,
    homeUrl: getHomeUrl(dirName),
    url: `/${dirName}/${fileName}/`,
    svgUrl: `/${dirName}/${fileName}.svg`,
    ogImageUrl: `/assets/og/${id}.jpg`,
    gifUrl: `/assets/conversions/${id}.gif`,
    mp4Url: `/assets/conversions/${id}.mp4`,
    rawXML,
    minXML,
  };
};

const getAnimations = () => {
  const list = listGenerators('animations')
    // .filter(path => path.includes('48/'))
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
      title: `Animation ${dirName}`.toUpperCase(),
      name: dirName,
      homeUrl: getHomeUrl(dirName),
      // Just use the first animation as the og image.
      ogImageUrl: data.ogImageUrl,
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
