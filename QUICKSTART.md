# Quick Start Guide

Get Gemini Word up and running in minutes!

## Prerequisites Check

Before you begin, make sure you have:

- [ ] **Node.js 18+** installed ([Download](https://nodejs.org/))
- [ ] **Rust 1.70+** installed ([Download](https://rustup.rs/))
- [ ] Platform-specific dependencies installed (see below)

### Platform-Specific Prerequisites

#### Linux (Ubuntu/Debian)
```bash
sudo apt update && sudo apt install -y \
    libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

#### macOS
```bash
xcode-select --install
```

#### Windows
- Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Install [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

## Installation

### Method 1: Using the Setup Script (Linux/macOS)

```bash
# Clone the repository
git clone <repository-url>
cd gemini-word

# Run the setup script
./setup.sh

# Start development
npm run tauri dev
```

### Method 2: Manual Setup

```bash
# Clone the repository
git clone <repository-url>
cd gemini-word

# Install Node.js dependencies
npm install

# Verify Rust dependencies
cd src-tauri
cargo check
cd ..

# Start development
npm run tauri dev
```

## First Run

When you first run the application:

1. **Development Mode**:
   ```bash
   npm run tauri dev
   ```
   - This starts the Vite dev server (frontend)
   - Compiles and runs the Rust backend
   - Opens the application window
   - Enables hot-reload for frontend changes

2. **What to expect**:
   - First build takes 5-10 minutes (downloads and compiles dependencies)
   - Subsequent builds are much faster (1-2 minutes)
   - A window will open with the Gemini Word editor

## Basic Usage

### Creating Your First Document

1. **Start typing** in the white editor area
2. **Format text** using the toolbar:
   - Select a font from the dropdown
   - Choose a font size
   - Click Bold, Italic, or Underline
   - Click alignment buttons
   - Choose a text color

### Saving Your Document

1. Click the **Save** button in the menu bar
2. Choose a location and filename
3. Your document is saved as a `.docx` file

### Opening an Existing Document

1. Click the **Open** button
2. Select a `.docx` file
3. The document content loads into the editor

## Building for Production

When you're ready to create a distributable application:

```bash
npm run tauri build
```

The built application will be in:
- **Linux**: `src-tauri/target/release/bundle/`
  - `.deb` for Debian/Ubuntu
  - `.AppImage` for universal Linux
- **macOS**: `src-tauri/target/release/bundle/`
  - `.dmg` installer
  - `.app` application bundle
- **Windows**: `src-tauri/target/release/bundle/`
  - `.msi` installer
  - `.exe` executable

## Common First-Time Issues

### "failed to get cargo metadata"
→ Make sure Rust is installed: `cargo --version`
→ See [TROUBLESHOOTING.md](TROUBLESHOOTING.md#error-failed-to-get-cargo-metadata)

### "npm: command not found"
→ Install Node.js from https://nodejs.org/

### Build takes forever
→ First build downloads and compiles all dependencies
→ This is normal! Grab a coffee ☕

### Port 1420 already in use
→ Another instance might be running
→ Stop it with `Ctrl+C` in the terminal

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) if you encounter issues
- Explore the source code to understand how it works
- Contribute! See [CONTRIBUTING.md](CONTRIBUTING.md)

## Development Tips

### Hot Reload
Changes to React/TypeScript code reload automatically in development mode.

### Rust Changes
Changes to Rust code require a restart:
1. Stop the dev server (`Ctrl+C`)
2. Run `npm run tauri dev` again

### Debugging
- **Frontend**: Open DevTools with `F12` or `Ctrl+Shift+I`
- **Backend**: Check terminal output for Rust logs

### Faster Rebuilds
Use `cargo watch` for automatic Rust recompilation:
```bash
cargo install cargo-watch
cd src-tauri
cargo watch -x check
```

## Getting Help

Having trouble? Check these resources:

1. [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues and solutions
2. [README.md](README.md) - Full documentation
3. GitHub Issues - Report bugs or ask questions
4. Tauri Docs - https://tauri.app/
5. docx-rs Repo - https://github.com/bokuweb/docx-rs

## What's Next?

Now that you have Gemini Word running, you can:

- Create and edit documents
- Explore the code to learn how it works
- Add new features (tables, images, etc.)
- Customize the UI to your liking
- Share your documents with others

Happy editing! 📝
