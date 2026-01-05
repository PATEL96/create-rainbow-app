/**
 * Package installation functions for create-rainbow-app
 */
const { execSync } = require("child_process");

/**
 * Creates a new Next.js application with the specified configuration
 * @param {string} projectName - Name of the project
 * @param {string} packageManager - Package manager to use
 * @param {boolean} useAppRouter - Whether to use App Router
 * @param {Object} chalk - Chalk instance for colored output
 */
function createNextApp(projectName, packageManager, useAppRouter, chalk) {
	console.log(
		chalk.blue("Creating Next.js app with TypeScript and Tailwind CSS..."),
	);

	const appFlag = useAppRouter ? "--app" : "";
	const createNextCommand =
		packageManager === "bun"
			? `bunx create-next-app@latest ${projectName} --typescript --react-compiler --tailwind --eslint --src-dir ${appFlag} --import-alias="@/*"`
			: `npx create-next-app@latest ${projectName} --typescript --react-compiler --tailwind --eslint --src-dir ${appFlag} --import-alias="@/*"`;

	try {
		execSync(createNextCommand, { stdio: "inherit" });
	} catch (error) {
		throw new Error(`Failed to create Next.js app: ${error.message}`);
	}
}

/**
 * Installs required dependencies
 * @param {string} packageManager - Package manager to use
 * @param {Object} chalk - Chalk instance for colored output
 */
function installDependencies(packageManager, chalk) {
	try {
		console.log(chalk.blue("Installing packages..."));
		const installCommand =
			packageManager === "bun"
				? "bun add @rainbow-me/rainbowkit wagmi viem@2.x @tanstack/react-query"
				: "yarn add @rainbow-me/rainbowkit wagmi viem@2.x @tanstack/react-query";

		execSync(installCommand, { stdio: "inherit" });
	} catch (error) {
		throw new Error(`Failed to install dependencies: ${error.message}`);
	}
}

/**
 * Install additional wallet connector packages
 * @param {string} packageManager - Package manager to use (bun or yarn)
 * @param {Object} chalk - Chalk instance for colored output
 */
function installWalletConnectors(packageManager, chalk) {
	try {
		console.log(chalk.blue("Installing wallet connector packages..."));
		const packages = [
			"@base-org/account",
			"@coinbase/wallet-sdk",
			"@metamask/sdk",
			"@safe-global/safe-apps-provider",
			"@safe-global/safe-apps-sdk",
			"@walletconnect/ethereum-provider",
		].join(" ");

		const installCommand =
			packageManager === "bun"
				? `bun add ${packages}`
				: `yarn add ${packages}`;

		execSync(installCommand, { stdio: "inherit" });
		console.log(
			chalk.green("Wallet connector packages installed successfully"),
		);
	} catch (error) {
		throw new Error(
			`Failed to install wallet connector packages: ${error.message}`,
		);
	}
}

/**
 * Setup and configure shadcn/ui
 * @param {string} packageManager - Package manager to use (bun or yarn)
 * @param {Object} chalk - Chalk instance for colored output
 */
function setupShadcnUI(packageManager, chalk) {
	try {
		console.log(chalk.blue("Initializing shadcn/ui..."));
		const shadcnCommand =
			packageManager === "bun"
				? "bunx shadcn@latest init"
				: "npx shadcn@latest init";

		execSync(shadcnCommand, { stdio: "inherit" });

		const shadcnCommandInstall =
			packageManager === "bun"
				? "bunx shadcn@latest add button"
				: "npx shadcn@latest add button";

		execSync(shadcnCommandInstall, { stdio: "inherit" });
	} catch (error) {
		throw new Error(`Failed to setup shadcn/ui: ${error.message}`);
	}
}

module.exports = {
	createNextApp,
	installDependencies,
	installWalletConnectors,
	setupShadcnUI,
};
