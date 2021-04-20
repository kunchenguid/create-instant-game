import chalk from 'chalk';
import { spawn } from 'child_process';
import { Command } from 'commander';

function actionAsync(projectName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const npx = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', [
      'create-react-app',
      projectName,
      '--template',
      'typescript',
    ]);
    npx.stdout.on('data', (data: Buffer) => {
      process.stdout.write(data);
    });
    npx.stderr.on('data', (data: Buffer) => {
      process.stderr.write(data);
    });
    npx.on('error', error => {
      console.log(chalk.red(error.message));
      reject(error);
    });
    npx.on('close', () => {
      resolve();
    });
  });
}

export default async function runAsync() {
  const program = new Command('create-instant-game')
    .arguments('<project-name>')
    .action(actionAsync);
  await program.parseAsync(process.argv);
}
