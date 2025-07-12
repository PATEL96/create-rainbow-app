# create-rainbow-app

![Static Badge](https://img.shields.io/badge/Terminal-CLI-red?style=for-the-badge&logo=console)
![NPM Version](https://img.shields.io/npm/v/create-rainbow-app?style=for-the-badge&logo=NPM)
![GitHub Package Version](https://img.shields.io/github/package-json/v/PATEL96/create-rainbow-app?label=GitHub%20Package&style=for-the-badge&logo=github)

Easily bootstrap your **RainbowKit**-based project with a single command!
Supports **`Bun`** and **`Yarn`** for dependency management. 🚀

---

## Features

- Clone a pre-configured [RainbowKit](https://www.rainbowkit.com/) template repository.
- Installs dependencies with **Bun** (preferred) or **Yarn** automatically.
- Provides clear next steps for starting your development server.

---

## Usage

You can use this CLI tool with **bun** or **npx**:

### From npm registry (recommended)

#### Bun

```bash
bun create rainbow-app@latest <project-name>
```

#### NPX

```bash
npx create-rainbow-app@latest <project-name>
```

### From GitHub Packages

If you prefer using the GitHub Packages version:

```bash
npm config set @patel96:registry https://npm.pkg.github.com
npx @patel96/create-rainbow-app <project-name>
```
