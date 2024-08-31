#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
import inquirer from 'inquirer';

(async () => {
  // Dynamically import chalk
  const chalk = (await import('chalk')).default;

  // Check if yarn is installed
  try {
    execSync('yarn --version', { stdio: 'ignore' });
  } catch (error) {
    console.error(chalk.red('Yarn is required to run this script.'));
    console.log(chalk.yellow('Please install Yarn from the following link:'));
    console.log(chalk.blue('https://yarnpkg.com/getting-started/install'));
    process.exit(1);
  }

  const projectName = process.argv[2];
  if (!projectName) {
    console.error(chalk.red('Please provide a project name.'));
    process.exit(1);
  }

  const targetPath = path.join(process.cwd(), projectName);

  // Prompt the user to select a template
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Choose a template to start with:',
      choices: [
        { name: 'NextJs App Router Build', value: 'template-1' },
      ],
    }
  ]);

  const { template } = answers;
  const templatePath = path.join(__dirname, 'templates', template);

  // Copy the selected template to the target directory
  try {
    await fs.copy(templatePath, targetPath);
    console.log(chalk.green(`Template ${template} copied to ${targetPath}`));
  } catch (error) {
    console.error(chalk.red('Error copying template:', error));
    process.exit(1);
  }

  // Change directory to the target path
  process.chdir(targetPath);

  // Install required packages
  console.log(chalk.blue('Installing packages...'));
  execSync('yarn install', { stdio: 'inherit' }); // or 'npm install'

  console.log(chalk.green(`Project ${projectName} is ready!`));
  console.log(chalk.yellow(`To start working on your project, run:`));
  console.log(chalk.cyan(`\t cd ${projectName}`));
  console.log(chalk.cyan('\t yarn dev')); // or any other command you want to suggest
})();
