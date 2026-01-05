/**
 * Setup functions for create-rainbow-app
 */
const fs = require("fs");
const path = require("path");
const {
	wagmiTemplate,
	fontsTemplate,
	demoAbiTemplate,
	appRouter,
	pagesRouter,
} = require("./templates");

/**
 * Sets up Web3 configuration files
 * @param {Object} chalk - Chalk instance for colored output
 */
function setupWeb3Config(chalk) {
	try {
		// Create wagmi.ts file in src folder
		console.log(chalk.blue("Creating wagmi.ts configuration..."));
		fs.writeFileSync(path.join("src", "wagmi.ts"), wagmiTemplate);

		// Create lib folder and fonts.ts
		console.log(chalk.blue("Creating lib/fonts.ts..."));
		const libDir = path.join("src", "lib");
		fs.mkdirSync(libDir, { recursive: true });
		fs.writeFileSync(path.join(libDir, "fonts.ts"), fontsTemplate);

		// Create ABI folder and demo.json
		console.log(chalk.blue("Creating ABI demo.json..."));
		const abiDir = path.join("src", "ABI");
		fs.mkdirSync(abiDir, { recursive: true });
		fs.writeFileSync(
			path.join(abiDir, "demo.json"),
			JSON.stringify(demoAbiTemplate, null, 2),
		);
	} catch (error) {
		throw new Error(`Failed to setup Web3 configuration: ${error.message}`);
	}
}

/**
 * Sets up App Router template files
 * @param {Object} chalk - Chalk instance for colored output
 */
function setupAppRouter(chalk) {
	try {
		// Create provider directory
		console.log(chalk.blue("Creating provider directory..."));
		const providerDir = path.join("src", "provider");
		fs.mkdirSync(providerDir, { recursive: true });

		// Create web3provider.tsx
		console.log(chalk.blue("Creating web3provider.tsx..."));
		fs.writeFileSync(
			path.join(providerDir, "web3provider.tsx"),
			appRouter.provider,
		);

		// Update layout.tsx
		console.log(chalk.blue("Updating layout.tsx..."));
		fs.writeFileSync(path.join("src", "app", "layout.tsx"), appRouter.layout);

		// Update page.tsx
		console.log(chalk.blue("Updating page.tsx..."));
		fs.writeFileSync(path.join("src", "app", "page.tsx"), appRouter.page);
	} catch (error) {
		throw new Error(`Failed to setup App Router: ${error.message}`);
	}
}

/**
 * Sets up Pages Router template files
 * @param {Object} chalk - Chalk instance for colored output
 */
function setupPagesRouter(chalk) {
	try {
		// Create provider directory
		console.log(chalk.blue("Creating provider directory..."));
		const providerDir = path.join("src", "provider");
		fs.mkdirSync(providerDir, { recursive: true });

		// Create web3provider.tsx
		console.log(chalk.blue("Creating web3provider.tsx..."));
		fs.writeFileSync(
			path.join(providerDir, "web3provider.tsx"),
			pagesRouter.provider,
		);

		// Update _app.tsx
		console.log(chalk.blue("Updating _app.tsx..."));
		fs.writeFileSync(path.join("src", "pages", "_app.tsx"), pagesRouter.app);

		// Update index.tsx
		console.log(chalk.blue("Updating index.tsx..."));
		fs.writeFileSync(path.join("src", "pages", "index.tsx"), pagesRouter.index);
	} catch (error) {
		throw new Error(`Failed to setup Pages Router: ${error.message}`);
	}
}

/**
 * Updates template files with custom content
 * @param {boolean} isAppRouter - Whether using App Router or Pages Router
 * @param {Object} chalk - Chalk instance for colored output
 */
function updateTemplateFiles(isAppRouter, chalk) {
	try {
		if (isAppRouter) {
			setupAppRouter(chalk);
		} else {
			setupPagesRouter(chalk);
		}
	} catch (error) {
		throw new Error(`Failed to update template files: ${error.message}`);
	}
}

module.exports = {
	setupWeb3Config,
	setupAppRouter,
	setupPagesRouter,
	updateTemplateFiles,
};
