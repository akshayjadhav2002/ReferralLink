#!/bin/bash
echo "Switching to JSX/React version..."

# Backup current package.json
cp package.json package-vanilla.json

# Use JSX package.json
cp package-jsx.json package.json

# Update server to serve from root for Vite
# No changes needed as Vite will handle the frontend

echo "Switched to JSX version!"
echo "Run 'npm run dev' to start the React application with Vite"