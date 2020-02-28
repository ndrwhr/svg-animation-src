const glob = require('glob');
const path = require('path');
const puppeteer = require('puppeteer');
const rimraf = require('rimraf');

const ROOT = process.cwd();
const GENERATORS_DIR = path.join(ROOT, 'site/_svgs/generators');
const OUTPUT_DIR = path.join(ROOT, 'site/assets/og');

const listGenerators = dir => glob.sync(`${GENERATORS_DIR}/${dir}/**/*.js`);

rimraf.sync(`${OUTPUT_DIR}/*`);

(async () => {
  const generators = listGenerators('animations').filter(path =>
    /\/\w.js/.test(path),
  );

  const browser = await puppeteer.launch();

  for (const generatorPath of generators) {
    const modulePath = require.resolve(generatorPath);
    delete require.cache[modulePath];
    const generator = require(modulePath);

    const [, dirName, fileName] = /([\d\w]+)\/(\w+)\.js$/.exec(generatorPath);
    const id = `${dirName}-${fileName}`;

    const svg = generator(id);
    const content = svg.render({
      namespace: `svg-${id}`,
      disableAnimation: true,
      rootAnimationDelay: 0.3333 * svg.duration,
    });

    console.log(`generating ${id}`);

    const page = await browser.newPage();
    await page.setViewport({
      width: 1024,
      height: 1024,
    });
    await page.setContent(content);
    await page.screenshot({
      type: 'jpeg',
      quality: 90,
      path: `${OUTPUT_DIR}/${id}.jpg`,
    });
    await page.close();
  }

  await browser.close();
})();
