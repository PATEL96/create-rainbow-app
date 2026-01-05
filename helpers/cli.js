/**
 * CLI utility functions for create-rainbow-app
 */
const { execSync } = require("child_process");
const readline = require("readline");

/**
 * Displays a colorful welcome banner
 * @param {Object} chalk - Chalk instance for colored output
 */
function displayWelcomeBanner(chalk) {
	console.clear();
	console.log(
		chalk.cyan.bold(`
     ██╗    ██╗███████╗██████╗ ██████╗     ██████╗  █████╗ ██████╗ ██████╗
     ██║    ██║██╔════╝██╔══██╗╚════██╗    ██╔══██╗██╔══██╗██╔══██╗██╔══██╗
     ██║ █╗ ██║█████╗  ██████╔╝ █████╔╝    ██║  ██║███████║██████╔╝██████╔╝
     ██║███╗██║██╔══╝  ██╔══██╗ ╚═══██╗    ██║  ██║██╔══██║██╔═══╝ ██╔═══╝
     ╚███╔███╔╝███████╗██████╔╝██████╔╝    ██████╔╝██║  ██║██║     ██║
      ╚══╝╚══╝ ╚══════╝╚═════╝ ╚═════╝     ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝
             `),
	);
	console.log(
		chalk.blue.bold(
			"    Production-ready Web3 dApp template with Next.js, TypeScript, RainbowKit, Wagmi, viem & ShadCN/UI!",
		),
	);
	console.log(
		chalk.magenta.bold(
			"    Supports both Pages Router and App Router architectures",
		),
	);
	console.log(
		chalk.gray(
			"    ---------------------------------------------------------------------------------------------------------\n",
		),
	);
}

/**
 * Validates the project name from command line arguments
 * @param {string} name - Project name from command line
 * @param {Object} chalk - Chalk instance for colored output
 * @returns {string} Validated project name
 */
function validateProjectName(name, chalk) {
	if (!name) {
		throw new Error(chalk.red("Please provide a project name."));
	}
	return name;
}

/**
 * Determines which package manager to use (bun or yarn)
 * @param {Object} chalk - Chalk instance for colored output
 * @returns {string} Package manager to use ('bun' or 'yarn')
 */
function determinePackageManager(chalk) {
	try {
		execSync("bun --version", { stdio: "ignore" });
		return "bun";
	} catch (bunError) {
		try {
			execSync("yarn --version", { stdio: "ignore" });
			return "yarn";
		} catch (yarnError) {
			console.error(
				chalk.red(
					"Neither Bun nor Yarn is installed. One of these is required to run this script.",
				),
			);
			console.log(
				chalk.yellow("Install Bun from:"),
				chalk.blue("https://bun.sh/"),
			);
			console.log(
				chalk.yellow("Install Yarn from:"),
				chalk.blue("https://yarnpkg.com/getting-started/install"),
			);
			process.exit(1);
		}
	}
}

/**
 * Asks user for router preference
 * @param {Object} chalk - Chalk instance for colored output
 * @returns {Promise<boolean>} True if App Router, false if Pages Router
 */
async function askForRouterPreference(chalk) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		console.log(chalk.blue("Which router would you like to use?"));
		console.log(chalk.yellow("1. Pages Router (Traditional)"));
		console.log(chalk.yellow("2. App Router (New, Recommended)"));

		rl.question(chalk.green("Enter your choice (1 or 2): "), (answer) => {
			rl.close();
			const choice = answer.trim();
			if (choice === "2") {
				console.log(chalk.blue("Selected: App Router"));
				resolve(true);
			} else {
				console.log(chalk.blue("Selected: Pages Router"));
				resolve(false);
			}
		});
	});
}

/**
 * Displays success message with next steps
 * @param {string} projectName - Name of the project
 * @param {string} packageManager - Package manager used
 * @param {boolean} isAppRouter - Whether using App Router or Pages Router
 * @param {Object} chalk - Chalk instance for colored output
 */
function displaySuccessMessage(projectName, packageManager, isAppRouter, chalk) {
	console.log(chalk.green(`\nProject ${projectName} is ready!`));
	console.log(
		chalk.yellow(
			`Router type: ${isAppRouter ? "App Router" : "Pages Router"}`,
		),
	);
	console.log(chalk.yellow(`To start working on your project, run:`));
	console.log(chalk.cyan(`\t cd ${projectName}`));
	console.log(
		chalk.cyan(`\t ${packageManager === "bun" ? "bun dev" : "yarn dev"}`),
	);
}

module.exports = {
	displayWelcomeBanner,
	validateProjectName,
	determinePackageManager,
	askForRouterPreference,
	displaySuccessMessage,
};
