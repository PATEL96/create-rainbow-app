#!/usr/bin/env node
const path = require("path");

const {
	displayWelcomeBanner,
	validateProjectName,
	determinePackageManager,
	askForRouterPreference,
	displaySuccessMessage,
} = require("./helpers/cli");

const {
	createNextApp,
	installDependencies,
	setupShadcnUI,
} = require("./helpers/install");

const { setupWeb3Config, updateTemplateFiles } = require("./helpers/setup");

/**
 * Create Rainbow App - A production-ready Web3 dApp template generator
 * with Next.js, TypeScript, RainbowKit, Wagmi, viem & ShadCN/UI
 */
(async () => {
	try {
		// Dynamically import chalk
		const chalk = (await import("chalk")).default;

		// Display welcome banner
		displayWelcomeBanner(chalk);

		// Validate project name
		const projectName = validateProjectName(process.argv[2], chalk);
		const targetPath = path.join(process.cwd(), projectName);

		// Ask user for router preference
		const useAppRouter = await askForRouterPreference(chalk);

		// Determine package manager to use (bun or yarn)
		const packageManager = determinePackageManager(chalk);

		// Create Next.js app
		createNextApp(projectName, packageManager, useAppRouter, chalk);

		// Change directory to the target path
		process.chdir(targetPath);

		// Set up Web3 configuration
		setupWeb3Config(chalk);

		// Install dependencies
		installDependencies(packageManager, chalk);

		// Configure UI components
		setupShadcnUI(packageManager, chalk);

		// Update starter template files
		updateTemplateFiles(useAppRouter, chalk);

		// Display success message
		displaySuccessMessage(projectName, packageManager, useAppRouter, chalk);
	} catch (error) {
		console.error(`\nError: ${error.message}`);
		process.exit(1);
	}
})();
