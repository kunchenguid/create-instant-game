import chalk from 'chalk';
import { spawn, execSync } from 'child_process';
import { program } from 'commander';
import fs from 'fs-extra';
import moment from 'moment';
import path from 'path';

function createReactAppAsync(projectName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('Running create-react-app...'));

    const npx = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', [
      'create-react-app',
      projectName,
      '--template',
      'typescript',
    ]);
    npx.on('error', error => {
      console.log(chalk.red(error.message));
      reject(error);
    });
    npx.on('close', () => {
      resolve();
    });
  });
}

async function copyTemplateFilesAsync(
  projectName: string,
  options: Record<string, unknown>
): Promise<void> {
  console.log(chalk.blue('Copying template files...'));

  const projectDir = path.join(process.cwd(), projectName);
  const templateDir = path.join(__dirname, '..', 'template');

  await fs.remove(path.join(projectDir, 'public'));
  await fs.copy(templateDir, projectDir);

  const publicFiles = await fs.readdir(path.join(projectDir, 'public'));
  publicFiles.forEach(file => {
    const fullFilePath = path.join(projectDir, 'public', file);
    const fileContent = fs.readFileSync(fullFilePath).toString('utf-8');
    const newContent = fileContent
      .replace(/{project-name}/g, projectName)
      .replace(/{project-owner-company}/g, options.ownerCompany as string)
      .replace(/{project-owner-email}/g, options.ownerEmail as string)
      .replace(/{project-display-name}/g, options.displayName as string)
      .replace(/{project-creation-date}/g, moment().format('YYYY-MM-DD'));
    fs.writeFileSync(fullFilePath, newContent);
  });
}

async function installDepsAsync(projectName: string): Promise<void> {
  console.log(chalk.blue('Installing dependencies...'));

  const devDependencies = [
    'shx',
    '@trivago/prettier-plugin-sort-imports',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    'prettier',
  ];

  devDependencies.forEach(dep => {
    execSync(
      `${process.platform === 'win32' ? 'yarn.cmd' : 'yarn'} add ${dep} -D`,
      {
        cwd: path.join(process.cwd(), projectName),
      }
    );
  });
}

async function actionAsync(
  projectName: string,
  options: Record<string, unknown>
): Promise<void> {
  await createReactAppAsync(projectName);
  await copyTemplateFilesAsync(projectName, options);
  await installDepsAsync(projectName);
}

export default async function runAsync() {
  program
    .arguments('<project-name>')
    .requiredOption(
      '-d, --display-name <display_name>',
      'Display name of the application'
    )
    .requiredOption(
      '-c, --owner-company <company_name>',
      'Name of your company that is building the game'
    )
    .requiredOption(
      '-e, --owner-email <owner_email>',
      'Email address used as a contact in privacy policy'
    )
    .action(actionAsync);
  await program.parseAsync(process.argv);
}
