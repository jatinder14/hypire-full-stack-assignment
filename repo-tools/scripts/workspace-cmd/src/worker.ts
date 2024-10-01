import { exec } from 'child_process';
import humanizeDuration from 'humanize-duration';
import { promisify } from 'util';
import { parentPort } from 'worker_threads';
import { MessageType } from './models';

const execAsync = promisify(exec);

parentPort?.on('message', (message: MessageType) => {
  runCommand(message)
    .then(() => {
      parentPort?.postMessage({ success: true });
    })
    .catch((err) => {
      let errorToShow: any = err;
      if (err?.stdout) {
        errorToShow = err.stdout;
      }
      console.log(
        `\x1b[31m[${message.currentIndex + 1}/${message.numberOfPackages}] ${
          message.pkg.name
        } - failed\x1b[0m\n`,
        errorToShow
      );
      parentPort?.postMessage({ success: false });
    });
});

async function runCommand(message: MessageType) {
  const { cmd, pkg, currentIndex, numberOfPackages } = message;

  const startTime = Date.now();

  console.log(`\x1b[32m[${currentIndex + 1}/${numberOfPackages}] ${pkg.name}\x1b[0m`);

  // check if command exist in package.json
  const packageJson = require(`${__dirname}/../../../../${pkg.location}/package.json`);
  if (!packageJson.scripts || !packageJson.scripts[cmd]) {
    console.log(
      `\x1b[33m[${currentIndex + 1}/${numberOfPackages}] ${
        pkg.name
      } - no script ${cmd} in package.json\x1b[0m`
    );
    return;
  }

  const { stdout, stderr } = await execAsync(`yarn workspace ${pkg.name} run ${cmd}`);
  if (stderr) {
    console.warn(`\x1b[33m[${currentIndex + 1}/${numberOfPackages}] ${pkg.name} - warning\n`, stderr);
  }

  // console.log(`\x1b[32m[${currentIndex + 1}/${numberOfPackages}] ${pkg.name} - done\x1b[0m`);
  const endTime = Date.now();
  const time = endTime - startTime;
  console.log(
    `\x1b[32m[${currentIndex + 1}/${numberOfPackages}] ${
      pkg.name
    } - completed successfully in ${humanizeDuration(time)}\x1b[0m`
  );
}
