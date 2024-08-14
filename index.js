#!/usr/bin/env node

const { execSync } = require('child_process');
const gitClone = require('git-clone');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

    // Change directory to the target path
    process.chdir(targetPath);

    // Create a readline interface to get user input
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Which package manager do you want to use? (yarn/npm): ', (answer) => {
        const packageManager = answer.toLowerCase() === 'npm' ? 'npm' : 'yarn';
        
        console.log(`Installing packages with ${packageManager}...`);
        execSync(`${packageManager} install`, { stdio: 'inherit' });

        console.log(`Project ${projectName} is ready!`);
        console.log(`To start working on your project, run:`);
        console.log(`cd ${projectName}`);
        console.log(`${packageManager} run dev`); // or any other command you want to suggest

        // Close the readline interface
        rl.close();
    });
});
