import chalk from 'chalk';
import { Command } from 'commander';

export default function run() {
  const program = new Command('create-instant-game')
    .arguments('<project-name>')
    .action((projectName: string, command: Command) => {
      console.log(chalk.red(projectName));
      console.dir(command);
    });
  program.parse(process.argv);
}
