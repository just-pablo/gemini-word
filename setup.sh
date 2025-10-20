#!/bin/bash

# Gemini Word - Setup Script
# This script will set up the development environment and install all dependencies

set -e  # Exit on error

echo "🚀 Setting up Gemini Word..."
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check for Rust
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust is not installed. Please install Rust from https://rustup.rs/"
    exit 1
fi

echo "✅ Node.js $(node --version) found"
echo "✅ Rust $(cargo --version | awk '{print $2}') found"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install
echo "✅ Frontend dependencies installed"
echo ""

# Check Rust dependencies
echo "🔧 Checking Rust dependencies..."
cd src-tauri
cargo check
cd ..
echo "✅ Rust dependencies verified"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "To run in development mode:"
echo "  npm run tauri dev"
echo ""
echo "To build for production:"
echo "  npm run tauri build"
echo ""
