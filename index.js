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
    console.log(`Cloned to ${targetPath}`);
    fs.rmSync(path.join(targetPath, '.git'), { recursive: true, force: true });
    console.log('Removed .git directory');
    console.log(`Project ${projectName} is ready!`);
    console.log(`run tese to move ahead`)
    console.log(`cd ${projectName}`)
    console.log('yarn install')
});
