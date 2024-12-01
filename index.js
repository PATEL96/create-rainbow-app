#!/usr/bin/env node

const { execSync } = require('child_process');
const gitClone = require('git-clone');
const fs = require('fs');
const path = require('path');

(async () => {
    // Dynamically import chalk
    const chalk = (await import('chalk')).default;

    const repoUrl = 'https://github.com/PATEL96/BaseTemplate-Rainbowkit.git';

    const checkCommand = (cmd) => {
        try {
            execSync(`${cmd} --version`, { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    };

    let packageManager = null;

    if (checkCommand('bun')) {
        packageManager = 'bun';
    } else if (checkCommand('yarn')) {
        packageManager = 'yarn';
    } else if (checkCommand('npm')) {
        packageManager = 'npm';
    }

    if (!packageManager) {
        console.error(chalk.red('No package manager found!'));
        console.log(chalk.yellow('Please install one of the following:'));
        console.log(chalk.blue('- Bun: https://bun.sh/'));
        console.log(chalk.blue('- Yarn: https://yarnpkg.com/getting-started/install'));
        console.log(chalk.blue('- npm (comes with Node.js): https://nodejs.org/'));
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
        console.log(chalk.blue(`Installing packages using ${packageManager}...`));
        const installCommand = packageManager === 'bun' ? 'bun install' : `${packageManager} install`;
        execSync(installCommand, { stdio: 'inherit' });

        console.log(chalk.green(`Project ${projectName} is ready!`));
        console.log(chalk.yellow('To start working on your project, run:'));
        console.log(chalk.cyan(`\t cd ${projectName}`));
        const devCommand = packageManager === 'bun' ? 'bun dev' : `${packageManager} dev`;
        console.log(chalk.cyan(`\t ${devCommand}`));
    });
})();
