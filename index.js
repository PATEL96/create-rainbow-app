#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

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

        // Use the selected router type
        const isAppRouter = useAppRouter;

        // Set up Web3 configuration
        setupWeb3Config(chalk);

        // Install dependencies
        installDependencies(packageManager, chalk);

        // Configure UI components
        setupShadcnUI(packageManager, chalk);

        // Update starter template files
        updateTemplateFiles(isAppRouter, chalk);

        // Display success message
        displaySuccessMessage(projectName, packageManager, isAppRouter, chalk);
    } catch (error) {
        console.error(`\n❌ Error: ${error.message}`);
        process.exit(1);
    }
})();

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
            "    🌈 Production-ready Web3 dApp template with Next.js, TypeScript, RainbowKit, Wagmi, viem & ShadCN/UI!",
        ),
    );
    console.log(
        chalk.magenta.bold(
            "    📁 Supports both Pages Router and App Router architectures",
        ),
    );
    console.log(
        chalk.gray(
            "    ─────────────────────────────────────────────────────────────────────────────────────\n",
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
    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        console.log(chalk.blue("Which router would you like to use?"));
        console.log(chalk.yellow("1. Pages Router (Traditional)"));
        console.log(chalk.yellow("2. App Router (New, Recommended)"));

        readline.question(
            chalk.green("Enter your choice (1 or 2): "),
            (answer) => {
                readline.close();
                const choice = answer.trim();
                if (choice === "2") {
                    console.log(chalk.blue("Selected: App Router"));
                    resolve(true);
                } else {
                    console.log(chalk.blue("Selected: Pages Router"));
                    resolve(false);
                }
            },
        );
    });
}

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

    const appFlag = useAppRouter ? "--app" : "--app=false";
    const createNextCommand =
        packageManager === "bun"
            ? `bunx create-next-app@latest ${projectName} --typescript --tailwind --eslint --src-dir ${appFlag} --import-alias="@/*" --disable-git`
            : `npx create-next-app@latest ${projectName} --typescript --tailwind --eslint --src-dir ${appFlag} --import-alias="@/*" --disable-git`;

    try {
        execSync(createNextCommand, { stdio: "inherit" });
    } catch (error) {
        throw new Error(`Failed to create Next.js app: ${error.message}`);
    }
}

/**
 * Sets up Web3 configuration files
 * @param {Object} chalk - Chalk instance for colored output
 */
function setupWeb3Config(chalk) {
    try {
        // Create wagmi.ts file in src folder
        console.log(chalk.blue("Creating wagmi.ts configuration..."));
        const wagmiContent = `import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, optimism, arbitrum, base } from "viem/chains";

export const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});`;

        fs.writeFileSync(path.join("src", "wagmi.ts"), wagmiContent);

        // Create ABI folder and demo.json
        console.log(chalk.blue("Creating ABI demo.json..."));
        const abiDir = path.join("src", "ABI");
        fs.mkdirSync(abiDir, { recursive: true });

        const demoAbi = [
            {
                inputs: [
                    {
                        internalType: "string",
                        name: "_greeting",
                        type: "string",
                    },
                ],
                name: "setGreeting",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
            },
            {
                inputs: [],
                name: "greeting",
                outputs: [
                    {
                        internalType: "string",
                        name: "",
                        type: "string",
                    },
                ],
                stateMutability: "view",
                type: "function",
            },
        ];

        fs.writeFileSync(
            path.join(abiDir, "demo.json"),
            JSON.stringify(demoAbi, null, 2),
        );
    } catch (error) {
        throw new Error(`Failed to setup Web3 configuration: ${error.message}`);
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
 * Sets up shadcn/ui components
 * @param {string} packageManager - Package manager to use
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

/**
 * Sets up Pages Router template files
 * @param {Object} chalk - Chalk instance for colored output
 */
function setupPagesRouter(chalk) {
    // Update _app.tsx with providers
    console.log(chalk.blue("Setting up providers in _app.tsx..."));
    const appContent = `import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from '@/wagmi';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}`;

    fs.writeFileSync(path.join("src", "pages", "_app.tsx"), appContent);

    // Update index.tsx with custom content
    console.log(chalk.blue("Updating index.tsx with custom content..."));
    const indexContent = `import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={\`\${geistSans.className} \${geistMono.className} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]\`}
    >
      <main className="flex flex-col gap-10 row-start-2 items-center sm:items-start">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold text-center">
            🎒 Web3 Dapp Template
          </h1>
          <p className="text-lg text-center text-gray-600 dark:text-gray-400">
            Web3 dApp template with Next.js, TypeScript, Tailwind CSS & shadcn/ui
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 w-full">
          <ConnectButton />

          <div className="w-full p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">
              🚀 Get Started
            </h2>
            <ol className="list-inside list-decimal text-sm space-y-2 font-[family-name:var(--font-geist-mono)]">
              <li>
                Edit{" "}
                <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
                  src/pages/index.tsx
                </code>
              </li>
              <li>
                Update your project ID in{" "}
                <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
                  src/wagmi.ts
                </code>
              </li>
              <li>Add shadcn/ui components as needed</li>
              <li>Build your Web3 application!</li>
            </ol>
          </div>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="https://rainbowkit.com/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary">📚 RainbowKit Docs</Button>
          </Link>
          <Link
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">🎨 shadcn/ui</Button>
          </Link>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-500">
        <span>Built with ❤️ using Web3 Dapp Template</span>
      </footer>
    </div>
  );
}`;

    fs.writeFileSync(path.join("src", "pages", "index.tsx"), indexContent);
}

/**
 * Sets up App Router template files
 * @param {Object} chalk - Chalk instance for colored output
 */
function setupAppRouter(chalk) {
    // Create Web3Provider directory
    console.log(chalk.blue("Creating Web3Provider directory..."));
    const providerDir = path.join("src", "Web3Provider");
    fs.mkdirSync(providerDir, { recursive: true });

    // Create Provider.tsx
    console.log(chalk.blue("Creating Provider.tsx..."));
    const providerContent = `"use client";
import { config } from "@/wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

export default function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>{children}</RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}`;

    fs.writeFileSync(path.join(providerDir, "Provider.tsx"), providerContent);

    // Update layout.tsx
    console.log(chalk.blue("Updating layout.tsx..."));
    const layoutContent = `import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/Web3Provider/Provider";
import "@rainbow-me/rainbowkit/styles.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={\`\${geistSans.variable} \${geistMono.variable} antialiased\`}
            >
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}`;

    fs.writeFileSync(path.join("src", "app", "layout.tsx"), layoutContent);

    // Update page.tsx
    console.log(chalk.blue("Updating page.tsx..."));
    const pageContent = `import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={\`\${geistSans.className} \${geistMono.className} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]\`}
    >
      <main className="flex flex-col gap-10 row-start-2 items-center sm:items-start">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold text-center">
            🎒 Web3 Dapp Template
          </h1>
          <p className="text-lg text-center text-gray-600 dark:text-gray-400">
            Web3 dApp template with Next.js, TypeScript, Tailwind CSS & shadcn/ui
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 w-full">
          <ConnectButton />

          <div className="w-full p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">
              🚀 Get Started
            </h2>
            <ol className="list-inside list-decimal text-sm space-y-2 font-[family-name:var(--font-geist-mono)]">
              <li>
                Edit{" "}
                <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
                  src/app/page.tsx
                </code>
              </li>
              <li>
                Update your project ID in{" "}
                <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
                  src/wagmi.ts
                </code>
              </li>
              <li>Add shadcn/ui components as needed</li>
              <li>Build your Web3 application!</li>
            </ol>
          </div>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="https://rainbowkit.com/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary">📚 RainbowKit Docs</Button>
          </Link>
          <Link
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">🎨 shadcn/ui</Button>
          </Link>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-500">
        <span>Built with ❤️ using Web3 Dapp Template</span>
      </footer>
    </div>
  );
}`;

    fs.writeFileSync(path.join("src", "app", "page.tsx"), pageContent);
}

/**
 * Displays success message with next steps
 * @param {string} projectName - Name of the project
 * @param {string} packageManager - Package manager used
 * @param {boolean} isAppRouter - Whether using App Router or Pages Router
 * @param {Object} chalk - Chalk instance for colored output
 */
function displaySuccessMessage(
    projectName,
    packageManager,
    isAppRouter,
    chalk,
) {
    console.log(chalk.green(`\n✅ Project ${projectName} is ready!`));
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
