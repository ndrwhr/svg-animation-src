// Requires both ffmpeg and gifsicle.

const glob = require('glob');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const cliProgress = require('cli-progress');
const childProcess = require('child_process');
const numChildren = require('os').cpus().length;

const ROOT = process.cwd();
const GENERATORS_DIR = path.join(ROOT, 'site/_svgs/generators/animations');
const OUTPUT_DIR = path.join(ROOT, 'site/assets/conversions');

const TMP_DIR = '/tmp/svg-gifs';

rimraf.sync(`${TMP_DIR}/*`);
mkdirp.sync(TMP_DIR);
// rimraf.sync(`${OUTPUT_DIR}/*`);
mkdirp.sync(OUTPUT_DIR);

const generators = glob
  .sync(`${GENERATORS_DIR}/**/*.js`)
  .filter(path => /\/\w.js/.test(path));
const maxGeneratorsPerProcess = Math.ceil(generators.length / numChildren);
const generatorGroups = [];
for (let i = 0; i < generators.length; i += maxGeneratorsPerProcess) {
  generatorGroups.push(generators.slice(i, i + maxGeneratorsPerProcess));
}

// create new container
const multibar = new cliProgress.MultiBar(
  {
    format: '{title} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}',
    clearOnComplete: false,
    hideCursor: true,
    autopadding: true,
  },
  cliProgress.Presets.rect,
);
const totalBar = multibar.create(generators.length, 0, {
  title: 'Total',
});

const children = new Set();

generatorGroups.forEach((group, i) => {
  const bar = multibar.create(group.length, 0, {
    title: `Thread ${i}`,
  });

  const child = childProcess.fork('./scripts/utils/gen-gifs-child.js');
  children.add(child);

  child.on('message', ({ type }) => {
    switch (type) {
      case 'UPDATE':
        totalBar.increment();
        bar.increment();
        break;
    }
  });

  child.on('disconnect', () => {
    // console.log(`Process ${i + 1} finished`);
    children.delete(child);

    if (children.size === 0) {
      multibar.stop();
      console.log(`Done`);
    }
  });

  child.send(group);
});
