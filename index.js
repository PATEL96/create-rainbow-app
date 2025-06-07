#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

(async () => {
    // Dynamically import chalk
    const chalk = (await import("chalk")).default;

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
        chalk.gray(
            "    ─────────────────────────────────────────────────────────────────────────────────────\n",
        ),
    );

    let packageManager = "bun";

    // Check if Bun is installed
    try {
        execSync("bun --version", { stdio: "ignore" });
        packageManager = "bun";
    } catch (bunError) {
        // Fallback to Yarn if Bun is not available
        try {
            execSync("yarn --version", { stdio: "ignore" });
            packageManager = "yarn";
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

    const projectName = process.argv[2];
    if (!projectName) {
        console.error(chalk.red("Please provide a project name."));
        process.exit(1);
    }

    const targetPath = path.join(process.cwd(), projectName);

    // Create Next.js app with TypeScript, Pages Router, and Tailwind CSS
    console.log(
        chalk.blue("Creating Next.js app with TypeScript and Tailwind CSS..."),
    );

    const createNextCommand =
        packageManager === "bun"
            ? `bunx create-next-app@latest ${projectName} --typescript --tailwind --eslint --src-dir --app=false --import-alias="@/* --disable-git"`
            : `npx create-next-app@latest ${projectName} --typescript --tailwind --eslint --src-dir --app=false --import-alias="@/* --disable-git"`;

    execSync(createNextCommand, { stdio: "inherit" });

    // Change directory to the target path
    process.chdir(targetPath);

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

    // Install required packages
    console.log(chalk.blue("Installing packages..."));
    const installCommand =
        packageManager === "bun"
            ? "bun add @rainbow-me/rainbowkit wagmi viem@2.x @tanstack/react-query"
            : "yarn add @rainbow-me/rainbowkit wagmi viem@2.x @tanstack/react-query";

    execSync(installCommand, { stdio: "inherit" });

    // Initialize shadcn/ui
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

    console.log(chalk.green(`Project ${projectName} is ready!`));
    console.log(chalk.yellow(`To start working on your project, run:`));
    console.log(chalk.cyan(`\t cd ${projectName}`));
    if (packageManager === "bun") {
        console.log(chalk.cyan("\t bun dev"));
    } else {
        console.log(chalk.cyan("\t yarn dev"));
    }
})();
