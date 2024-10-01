import { exec } from 'child_process';
import EventEmitter from 'events';
import os from 'os';
import { promisify } from 'util';
import { Worker } from 'worker_threads';
import { MAX_PROCESS, MessageType, PackageType, WorkerMessageType } from './models';
import { sortWithPackageTree } from './packageTree';

const execAsync = promisify(exec);

const args = process.argv.slice(2);

console.log('Running with args: ', args);

let cmd = '';
const numberOfCores = os.cpus().length;
let numberOfProcesses = numberOfCores / 2;
if (numberOfProcesses < 1) numberOfProcesses = 1;
if (numberOfProcesses > MAX_PROCESS) numberOfProcesses = MAX_PROCESS;
let buildTo = '';
let buildFrom = '';

for (const arg of args) {
  if (arg === '-h' || arg === '--help') {
    console.log(
      'Usage: \x1b[32myarn --cmd=(build|lint) [-p=parallel] [--to=package] [--from=package]\x1b[0m'
    );
    console.log('  \x1b[32m--cmd=(build|lint)\x1b[0m                 - command to run');
    console.log(
      '  \x1b[32m -p=parallel\x1b[0m                       - number of parallel processes, can be number or percentage'
    );
    console.log('  \x1b[32m--to=package\x1b[0m                       - package to build / lint to');
    console.log('  \x1b[32m--from=package\x1b[0m                     - package to build / lint from');
    process.exit(0);
  }

  if (arg.startsWith('--cmd=')) {
    cmd = arg.split('=')[1];
  }

  if (arg.startsWith('-p=')) {
    const value = arg.split('=')[1];
    if (value.endsWith('%')) {
      const percentage = parseInt(value.replace('%', ''));
      numberOfProcesses = Math.ceil((percentage / 100) * numberOfCores);
    } else {
      numberOfProcesses = parseInt(value);
    }
  }

  if (arg.startsWith('--to=')) {
    buildTo = arg.split('=')[1];
  }

  if (arg.startsWith('--from=')) {
    buildFrom = arg.split('=')[1];
  }
}

if (!cmd) {
  console.error('No command specified');
  process.exit(1);
}

class MyWorker {
  private worker = new Worker(__dirname + '/worker.js');
  private queue: MessageType[] = [];
  private emitter = new EventEmitter();
  private started = false;

  constructor(workerNumber: number) {
    this.worker = new Worker(__dirname + '/worker.js');

    this.worker.on('message', (message: WorkerMessageType) => {
      if (!message.success) {
        throw new Error(`Worker ${workerNumber} failed`);
      }

      if (this.queue.length > 0) {
        this.worker.postMessage(this.queue.shift());
      } else {
        this.emitter.emit('finish');
      }
    });
  }

  async run(message: MessageType) {
    if (!this.started) {
      this.started = true;
      this.worker.postMessage(message);
    } else {
      this.queue.push(message);
    }
  }

  async waitForFinish() {
    if (!this.started) {
      return;
    }

    return new Promise((resolve) => {
      this.emitter.once('finish', resolve);
    });
  }

  terminate() {
    this.worker.terminate();
  }
}

const workers = <MyWorker[]>[];

for (let i = 0; i < numberOfProcesses; i++) {
  const worker = new MyWorker(i + 1);
  workers.push(worker);
}

async function run() {
  const { stdout, stderr } = await execAsync('yarn workspaces list --json');
  if (stderr) {
    throw stderr;
  }

  const allPkg: (PackageType & { idx: number })[] = sortWithPackageTree(
    stdout
      .split('\n')
      .filter(Boolean)
      .map((d) => JSON.parse(d))
      .filter((pkg) => pkg.location !== '.'),
    buildFrom,
    buildTo
  ).map((d, idx) => ({ ...d, idx: idx }));

  console.log(`Running ${cmd} on ${allPkg.length} packages with ${numberOfProcesses} processes`);

  const appPkgs: (PackageType & { idx: number })[] = [];
  for (const pkg of allPkg) {
    if (pkg.location.startsWith('apps')) {
      appPkgs.push(pkg);
      continue;
    }

    const workerNumber = pkg.idx % numberOfProcesses;
    const worker = workers[workerNumber];

    worker.run({
      cmd,
      pkg,
      currentIndex: pkg.idx,
      numberOfPackages: allPkg.length
    });
  }

  await Promise.all(workers.map((worker) => worker.waitForFinish()));

  if (appPkgs.length > 0) {
    const appWorker = new MyWorker(0);

    // add appWorker to workers for later termination
    workers.push(appWorker);

    for (const pkg of appPkgs) {
      appWorker.run({
        cmd,
        pkg,
        currentIndex: pkg.idx,
        numberOfPackages: allPkg.length
      });
    }

    await appWorker.waitForFinish();
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
}

run()
  .then(() => {
    console.log('Done');
    killAllWorkers();
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    killAllWorkers();
    process.exit(1);
  });

function killAllWorkers() {
  console.log('Killing all workers');
  for (const worker of workers) {
    worker.terminate();
  }
}

process.on('SIGINT', () => {
  killAllWorkers();
  process.exit(1);
});

process.on('SIGTERM', () => {
  killAllWorkers();
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error(err);
  killAllWorkers();
  process.exit(1);
});
