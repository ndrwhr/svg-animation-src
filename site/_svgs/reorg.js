// Reorganizes the generators.
const exec = require('child_process').exec;
const fs = require('fs');

function runCommands(commands) {
  function runCommand(command) {
    return new Promise((resolve, reject) => {
      console.log('running command:', command);
      exec(command, function(error, stdout, stderr) {
        if (error) {
          reject(error);
          Logger.log(error);
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

async function main() {
  const GENERATOR_PATH = 'scripts/svgs/generators';
  const allGenerators = fs
    .readdirSync(GENERATOR_PATH)
    .filter(fileName => fileName.endsWith('.js'));

  for (const fileName of allGenerators) {
    const [, num, variation] = /(\d+)-(\w)\.js/.exec(fileName);
    try {
      await fs.promises.access(
        `${GENERATOR_PATH}/${num}`,
        fs.constants.R_OK | fs.constants.W_OK,
      );
    } catch (e) {
      console.log('Making num dir');
      await fs.promises.mkdir(`${GENERATOR_PATH}/${num}`);
    }

    await fs.promises.rename(
      `${GENERATOR_PATH}/${fileName}`,
      `${GENERATOR_PATH}/${num}/${variation}.js`,
    );
  }
}

main();
