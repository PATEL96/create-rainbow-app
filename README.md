# create-rainbow-app

![Static Badge](https://img.shields.io/badge/Terminal-CLI-red?style=for-the-badge&logo=console)
![LICENSE](https://img.shields.io/npm/l/create-rainbow-app?style=for-the-badge&logo=license)

Easily bootstrap your **RainbowKit**-based project with a single command!
Supports **`Bun`** and **`Yarn`** for dependency management. 🚀

---

## Features

- Clone a pre-configured [RainbowKit](https://www.rainbowkit.com/) template repository.
- **Choose between Pages Router or App Router** during setup.
- Installs dependencies with **Bun** (preferred) or **Yarn** automatically.
- Automatically configures Web3 providers based on your router choice.
- Provides clear next steps for starting your development server.

## Router Support

The CLI now supports both Next.js routing approaches:

- **Pages Router**: Traditional Next.js routing with `_app.tsx` for providers
- **App Router**: Modern Next.js routing with `layout.tsx` and client components

During setup, you'll be prompted to choose your preferred router type. The template will be automatically configured with the appropriate file structure and provider setup.

---

## Usage

You can use this CLI tool with **bun**, **npx**, or other package managers:

### From npm Registry (recommended)

#### Bun

```bash
bun create rainbow-app@latest <project-name>
```

#### NPX

```bash
npx create-rainbow-app@latest <project-name>
```

#### Yarn

```bash
yarn create rainbow-app <project-name>
```

### From GitHub Packages

This package is also available on GitHub Packages:

```bash
# Configure npm to use GitHub Packages for the @patel96 scope
npm config set @patel96:registry https://npm.pkg.github.com

# Install using npx
npx @patel96/create-rainbow-app <project-name>
```

## Installation

If you want to install the package globally:

### From npm Registry

```bash
npm install -g create-rainbow-app
```

### From GitHub Packages

```bash
npm install -g @patel96/create-rainbow-app
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

[PATEL96](https://github.com/PATEL96)
