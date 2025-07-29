#!/bin/bash
echo "Switching to Vanilla JS version..."

# Restore vanilla package.json
cp package-vanilla.json package.json

# Copy vanilla HTML back
cp public/index-vanilla.html public/index.html

echo "Switched to Vanilla JS version!"
echo "The server will serve static files from public/ directory"