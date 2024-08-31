#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

(async () => {
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
    const templateName = "template-1";

    if (!projectName) {
        console.error(chalk.red('Please provide a project name.'));
        process.exit(1);
    }

    const targetPath = path.join(process.cwd(), projectName);
    const templatePath = path.join(__dirname, 'templates', templateName);

    if (!fs.existsSync(templatePath)) {
        console.error(chalk.red(`Template "${templateName}" does not exist.`));
        process.exit(1);
    }

    // Copy the selected template to the target directory
    try {
        await fs.copy(templatePath, targetPath);
        console.log(chalk.green(`Template "${templateName}" copied to ${targetPath}`));
    } catch (error) {
        console.error(chalk.red('Error copying template:', error));
        process.exit(1);
    }

    process.chdir(targetPath);

    // Install required packages
    console.log(chalk.blue('Installing packages...'));
    execSync('yarn install', { stdio: 'inherit' });

    console.log(chalk.green(`Project ${projectName} is ready!`));
    console.log(chalk.yellow(`To start working on your project, run:`));
    console.log(chalk.cyan(`\t cd ${projectName}`));
    console.log(chalk.cyan('\t yarn dev'));
})();
