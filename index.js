#!/usr/bin/env node

const { execSync } = require('child_process');
const gitClone = require('git-clone');
const fs = require('fs');
const path = require('path');

const repoUrl = 'https://github.com/PATEL96/BaseTemplate-Rainbowkit.git';

const projectName = process.argv[2];
if (!projectName) {
    console.error('Please provide a project name.');
    process.exit(1);
}

const targetPath = path.join(process.cwd(), projectName);

gitClone(repoUrl, targetPath, null, () => {
    fs.rmSync(path.join(targetPath, '.git'), { recursive: true, force: true });

    // Change directory to the target path
    process.chdir(targetPath);

    // Install required packages
    console.log('Installing packages...');
    execSync('yarn install', { stdio: 'inherit' }); // or 'npm install'

    console.log(`Project ${projectName} is ready!`);
    console.log(`To start working on your project, run:`);
    console.log(`cd ${projectName}`);
    console.log('yarn dev'); // or any other command you want to suggest
});
