const exec = require('child_process').exec;
const glob = require('glob');
const path = require('path');
const puppeteer = require('puppeteer');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, 'site/assets/conversions');

const TMP_DIR = '/tmp/svg-gifs';

const SIZE = 512;

const FPS = 60;
const DURATION = 10;
const STEP_SIZE = 1 / FPS;
const MAX_NUM_FRAMES = FPS * DURATION;

function runCommands(...commands) {
  function runCommand(command) {
    return new Promise((resolve, reject) => {
      // console.log('executing', command);
      exec(command, function(error, stdout, stderr) {
        if (error) {
          reject(error);
          // console.error(error, stderr);
          return;
        }
        resolve(stdout);
      });
    });
  }

  return commands.reduce((chain, command) => {
    return chain.then(() => runCommand(command));
  }, Promise.resolve());
}

const addWatermark = svg => {
  const waterMarkText = 'andrew.wang-hoyer.com'.toUpperCase();
  const [left, top, width, height] = svg.attributes.viewBox
    .split(' ')
    .map(v => parseFloat(v));

  const fontSize = 0.03 * width;
  const x = left + (width - width * 0.32) / 2;
  const y = top + fontSize + height * 0.97;

  svg.text(waterMarkText, {
    x,
    y,
    style: {
      fill: 'rgba(0, 0, 0, 0.2)',
      fontSize: `${fontSize}px`,
      fontFamily: `'Inconsolata', 'Courier New', Courier, 'Lucida Sans Typewriter',
      'Lucida Typewriter', monospace`,
    },
  });

  return svg;
};

async function generateGif(browser, generatorPath, index) {
  const modulePath = require.resolve(generatorPath);
  delete require.cache[modulePath];
  const generator = require(modulePath);

  const [, dirName, fileName] = /([\d\w]+)\/(\w+)\.js$/.exec(generatorPath);
  const id = `${dirName}-${fileName}`;
  const namespace = `svg-${id}`;
  const svg = generator(id);
  addWatermark(svg);

  const numFrames = Math.min(MAX_NUM_FRAMES, (2 * (svg.duration * FPS)) / 1000);

  const page = await browser.newPage();
  await page.setViewport({
    width: SIZE,
    height: SIZE,
  });
  await page.waitFor(100);

  for (let i = 0; i < numFrames; i++) {
    // console.log(`generating ${id} frame ${i + 1}/${numFrames}`);

    const content = svg.renderStep(namespace, 1000 * STEP_SIZE);
    if (!content) {
      // console.log('stepped too far');
      break;
    }

    await page.setContent(content);
    await page.waitFor(16);
    await page.screenshot({
      type: 'png',
      path: `${TMP_DIR}/${id}-frame-${i}.png`,
    });
  }

  await page.close();

  await runCommands(
    `ffmpeg -r 60 -f image2 -s ${SIZE}x${SIZE} -i ${TMP_DIR}/${id}-frame-%d.png -vcodec libx264 -crf 25 -pix_fmt yuv420p -vf reverse -y ${OUTPUT_DIR}/${id}.mp4`,

    `rm -rf ${TMP_DIR}/${id}*`,

    // https://engineering.giphy.com/how-to-make-gifs-with-ffmpeg/
    `ffmpeg -i ${OUTPUT_DIR}/${id}.mp4 -filter_complex "[0:v] fps=30,split [a][b];[a] palettegen [p];[b][p] paletteuse" -y ${OUTPUT_DIR}/${id}.gif`,

    // Further optimize the gif.
    `gifsicle --batch -O3 -i site/assets/conversions/${id}.gif`,
  );
}

process.on('message', async generators => {
  const browser = await puppeteer.launch();

  for (const generatorPath of generators) {
    await generateGif(
      browser,
      generatorPath,
      generators.indexOf(generatorPath),
    );

    process.send({
      type: 'UPDATE',
    });
  }

  await browser.close();

  process.disconnect();
});
