#!/usr/bin/env node

const { execSync } = require('child_process');
const gitClone = require('git-clone');
const fs = require('fs');
const path = require('path');

(async () => {
    // Dynamically import chalk
    const chalk = (await import('chalk')).default;

    const repoUrl = 'https://github.com/PATEL96/BaseTemplate-Rainbowkit.git';

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

    gitClone(repoUrl, targetPath, null, () => {
        fs.rmSync(path.join(targetPath, '.git'), { recursive: true, force: true });

        // Change directory to the target path
        process.chdir(targetPath);

        // Install required packages
        console.log(chalk.blue('Installing packages...'));
        execSync('yarn install --force', { stdio: 'inherit' }); // or 'npm install'

        console.log(chalk.green(`Project ${projectName} is ready!`));
        console.log(chalk.yellow(`To start working on your project, run:`));
        console.log(chalk.cyan(`\t cd ${projectName}`));
        console.log(chalk.cyan('\t yarn dev')); // or any other command you want to suggest
    });
})();
