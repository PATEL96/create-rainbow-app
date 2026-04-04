/**
 * Package installation functions for create-rainbow-app
 */
const { execSync } = require("child_process");

/**
 * Renders an arrow-key selection prompt and returns the chosen index
 * @param {Object} chalk - Chalk instance for colored output
 * @param {string} prompt - Question to display
 * @param {string[]} options - List of choices
 * @returns {Promise<number>} Index of selected option
 */
async function arrowSelect(chalk, prompt, options) {
	return new Promise((resolve) => {
		let selected = 0;

		process.stdout.write(chalk.blue(prompt) + "\n");
		options.forEach((opt, i) => {
			process.stdout.write(
				`  ${i === selected ? chalk.cyan("> " + opt) : "  " + opt}\n`,
			);
		});

		const redraw = () => {
			process.stdout.write(`\x1b[${options.length}A`);
			options.forEach((opt, i) => {
				process.stdout.write(
					`\r  ${i === selected ? chalk.cyan("> " + opt) : "  " + opt}\x1b[K\n`,
				);
			});
		};

		process.stdin.setRawMode(true);
		process.stdin.resume();
		process.stdin.setEncoding("utf8");

		const onData = (key) => {
			if (key === "\x1b[A") {
				selected = (selected - 1 + options.length) % options.length;
				redraw();
			} else if (key === "\x1b[B") {
				selected = (selected + 1) % options.length;
				redraw();
			} else if (key === "\r" || key === "\n") {
				process.stdin.setRawMode(false);
				process.stdin.pause();
				process.stdin.removeListener("data", onData);
				process.stdout.write("\n");
				resolve(selected);
			} else if (key === "\x03") {
				process.exit();
			}
		};

		process.stdin.on("data", onData);
	});
}

/**
 * Interactively gathers Next.js project options via arrow key prompts
 * @param {Object} chalk - Chalk instance for colored output
 * @returns {Promise<Object>} Selected options
 */
async function gatherNextOptions(chalk) {
	const routerIdx = await arrowSelect(
		chalk,
		"Which router would you like to use?",
		["App Router (Recommended)", "Pages Router"],
	);

	const linterIdx = await arrowSelect(
		chalk,
		"Which linter / formatter would you like to use?",
		["ESLint", "Biome"],
	);

	const reactCompilerIdx = await arrowSelect(
		chalk,
		"Enable React Compiler?",
		["Yes", "No"],
	);

	const gitIdx = await arrowSelect(chalk, "Initialize a git repository?", [
		"Yes",
		"No",
	]);

	return {
		useAppRouter: routerIdx === 0,
		useBiome: linterIdx === 1,
		useReactCompiler: reactCompilerIdx === 0,
		initGit: gitIdx === 0,
	};
}

/**
 * Creates a new Next.js application with the specified configuration
 * @param {string} projectName - Name of the project
 * @param {string} packageManager - Package manager to use
 * @param {Object} options - Project options gathered from gatherNextOptions
 * @param {Object} chalk - Chalk instance for colored output
 */
function createNextApp(projectName, packageManager, options, chalk) {
	console.log(
		chalk.blue("Creating Next.js app with TypeScript and Tailwind CSS..."),
	);

	const appFlag = options.useAppRouter ? "--app" : "--no-app";
	const linterFlag = options.useBiome ? "--biome" : "--eslint";
	const reactCompilerFlag = options.useReactCompiler
		? "--react-compiler"
		: "";
	const gitFlag = options.initGit ? "" : "--disable-git";

	const flags = [
		"--ts",
		"--tailwind",
		"--src-dir",
		'--import-alias="@/*"',
		"--yes",
		appFlag,
		linterFlag,
		reactCompilerFlag,
		gitFlag,
	]
		.filter(Boolean)
		.join(" ");

	const runner = packageManager === "bun" ? "bunx" : "npx";
	const createNextCommand = `${runner} create-next-app@latest ${projectName} ${flags}`;

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
	gatherNextOptions,
	createNextApp,
	installDependencies,
	installWalletConnectors,
	setupShadcnUI,
};
