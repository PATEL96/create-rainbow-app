#!/bin/bash

# Cleanup script for GitHub workflows
# This script removes the old workflows since we've consolidated them

# Check if both old workflow files exist
if [ -f "npm-publish.yml" ] && [ -f "release.yml" ]; then
  echo "Found old workflow files. Cleaning up..."

  # Remove old workflow files
  rm -f npm-publish.yml
  rm -f release.yml

  echo "✅ Removed old workflow files."
  echo "The new consolidated workflow 'npm-publish-and-release.yml' is now in place."
else
  echo "Old workflow files not found or already removed."
fi

echo "Cleanup complete!"
