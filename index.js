#!/usr/bin/env node

const { execSync } = require('child_process');
const gitClone = require('git-clone');
const fs = require('fs');
const path = require('path');

(async () => {
    // Dynamically import chalk
    const chalk = (await import('chalk')).default;

    const repoUrl = 'https://github.com/PATEL96/BaseTemplate-Rainbowkit.git';

    let packageManager = 'yarn';

    // Check if Bun is installed
    try {
        execSync('bun --version', { stdio: 'ignore' });
        packageManager = 'bun';
    } catch (bunError) {
        // Fallback to Yarn if Bun is not available
        try {
            execSync('yarn --version', { stdio: 'ignore' });
        } catch (yarnError) {
            console.error(chalk.red('Neither Bun nor Yarn is installed. One of these is required to run this script.'));
            console.log(chalk.yellow('Install Bun from:'), chalk.blue('https://bun.sh/'));
            console.log(chalk.yellow('Install Yarn from:'), chalk.blue('https://yarnpkg.com/getting-started/install'));
            process.exit(1);
        }
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
        execSync(`${packageManager} install`, { stdio: 'inherit' });

        console.log(chalk.green(`Project ${projectName} is ready!`));
        console.log(chalk.yellow(`To start working on your project, run:`));
        console.log(chalk.cyan(`\t cd ${projectName}`));
        if (packageManager === 'bun') {
            console.log(chalk.cyan('\t bun dev')); // Suggested command for Bun
        } else {
            console.log(chalk.cyan('\t yarn dev')); // Suggested command for Yarn
        }
    });
})();
