# GitHub Workflows for create-rainbow-app

This directory contains GitHub Actions workflows that automate the release and publishing processes for the `create-rainbow-app` package to the npm registry.

## Available Workflows

### 1. npm-publish.yml

This workflow automatically publishes the package to npm when:

- A new version is pushed to the main branch
- A new version tag (v\*) is created
- The workflow is manually triggered

**Features:**

- Automatically checks if the local version differs from the published version
- Only publishes when the version has changed or when explicitly triggered
- Uses npm token for authentication

### 2. release.yml

This workflow helps with creating new releases by:

- Bumping the version number (patch, minor, or major)
- Creating a Git tag
- Creating a GitHub Release
- Publishing the new version to npm

**How to use:**

1. Go to the "Actions" tab in your repository
2. Select "Create Release and Publish to npm" workflow
3. Click "Run workflow"
4. Choose the version bump type (patch, minor, major)
5. Optionally add release notes
6. Click "Run workflow" to execute

## Authentication

These workflows use an npm access token that you need to add as a repository secret:

1. Create an npm access token:
    - Log in to npmjs.org
    - Click on your profile icon → Access Tokens
    - Generate a new token (type: Automation)
    - Copy the token immediately

2. Add the token to GitHub repository secrets:
    - Go to your repository → Settings → Secrets and variables → Actions
    - Add a new secret named `NPM_TOKEN`
    - Paste your npm token as the value

## Custom Configuration

To modify the publishing behavior:

- Edit the `publishConfig` in your `package.json` file if needed
- Update the registry URL in the workflow files
- Change the Node.js version if needed

## Troubleshooting

If the workflows fail:

1. Check the workflow logs for detailed error messages
2. Ensure your `package.json` has the correct configuration
3. Verify you have the necessary permissions in the repository
4. Check that your npm token is valid and has the correct permissions

## Manual Publishing

If you need to publish manually:

```bash
npm login
npm publish
```
