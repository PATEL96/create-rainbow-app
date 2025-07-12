# GitHub Workflows for create-rainbow-app

This directory contains GitHub Actions workflows that automate the release and publishing processes for the `create-rainbow-app` package to the npm registry. The workflow automatically creates GitHub Releases for any tags you push.

## Available Workflow

### npm-publish-and-release.yml

This is a comprehensive workflow that handles both automatic and manual publishing to npm:

**Automatic Publishing Triggers:**

- When you push to the main branch (if version has changed)
- When you create a new tag (v\*) - also creates a GitHub Release automatically

**Manual Publishing Options:**

- Choose a version bump type (patch, minor, major)
- Add release notes
- Option to skip version bumping

## How to Use the Workflow

### Automatic Publishing

Simply push changes to the main branch after updating the version in package.json:

```bash
# Update version in package.json and create a tag
npm version patch  # Updates version and creates a git tag

# Push changes and tags to GitHub
git push origin main --tags
```

The workflow will:

1. Detect the tag push event
2. Automatically create a GitHub Release for the tag
3. Publish the version to npm

### Manual Publishing with Version Bump

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. Select "Publish and Release to npm" workflow
4. Click "Run workflow"
5. Configure the workflow run:
    - Choose version bump type: patch, minor, or major
    - Add release notes (optional)
    - Leave "Skip version bump" unchecked
6. Click "Run workflow"

This will:

- Bump the version according to your selection
- Find a unique version if the tag already exists
- Create a commit, tag and GitHub release
- Publish to npm
- Verify the publication

### Manual Publishing without Version Bump

If you've already updated the version manually:

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. Select "Publish and Release to npm" workflow
4. Click "Run workflow"
5. Configure the workflow run:
    - Check "Skip version bump"
6. Click "Run workflow"

This will publish the current version in package.json to npm.

## Authentication

This workflow requires an npm access token:

1. Create an npm access token:
    - Log in to npmjs.org
    - Click on your profile icon → Access Tokens
    - Generate a new token (type: Automation)
    - Copy the token immediately

2. Add the token to GitHub repository secrets:
    - Go to your repository → Settings → Secrets and variables → Actions
    - Add a new secret named `NPM_TOKEN`
    - Paste your npm token as the value

## Troubleshooting

If the workflow fails:

1. Check the workflow logs for detailed error messages
2. Ensure your package.json has the correct configuration
3. Verify that your npm token is valid and has publish permissions
4. Check if the version in package.json already exists on npm
5. Ensure you have write permissions to the repository
6. For tag-based releases, make sure your tag names start with 'v' followed by the version number (e.g., v1.2.3)

## Manual Publishing

If you need to publish manually:

```bash
npm login
npm publish
```

## Tag-Based Publishing

The recommended workflow is to use npm's version command which creates both the version update and the git tag:

```bash
# Create a new patch version (1.0.0 -> 1.0.1)
npm version patch

# Create a new minor version (1.0.0 -> 1.1.0)
npm version minor

# Create a new major version (1.0.0 -> 2.0.0)
npm version major

# Push the new version and tag to GitHub
git push origin main --tags
```

The workflow will automatically create a GitHub Release and publish to npm when it detects the new tag.
