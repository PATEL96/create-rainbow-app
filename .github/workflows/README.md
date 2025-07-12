# GitHub Workflows for create-rainbow-app

This directory contains GitHub Actions workflows that automate the release and publishing processes for the `create-rainbow-app` package.

## Available Workflows

### 1. npm-publish.yml

This workflow automatically publishes the package to GitHub Packages when:
- A new version is pushed to the main branch
- A new version tag (v*) is created
- The workflow is manually triggered

**Features:**
- Automatically checks if the local version differs from the published version
- Only publishes when the version has changed or when explicitly triggered
- Uses GitHub's built-in token for authentication

### 2. release.yml

This workflow helps with creating new releases by:
- Bumping the version number (patch, minor, or major)
- Creating a Git tag
- Creating a GitHub Release
- Publishing the new version to GitHub Packages

**How to use:**
1. Go to the "Actions" tab in your repository
2. Select "Create Release" workflow
3. Click "Run workflow"
4. Choose the version bump type (patch, minor, major)
5. Optionally add release notes
6. Click "Run workflow" to execute

## Authentication

These workflows use the `GITHUB_TOKEN` that is automatically provided by GitHub Actions. No additional secrets are required for basic functionality.

## Custom Configuration

To modify the publishing behavior:
- Edit the `publishConfig` in your `package.json` file
- Update the registry URL in the workflow files
- Change the Node.js version if needed

## Troubleshooting

If the workflows fail:
1. Check the workflow logs for detailed error messages
2. Ensure your `package.json` has the correct configuration
3. Verify you have the necessary permissions in the repository

## Manual Publishing

If you need to publish manually:
```bash
npm login --registry=https://npm.pkg.github.com --scope=@PATEL96
npm publish
```
