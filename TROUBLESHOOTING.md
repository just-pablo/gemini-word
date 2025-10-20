# Troubleshooting Guide

This guide covers common issues and their solutions when setting up and running Gemini Word.

## Table of Contents
- [Installation Issues](#installation-issues)
- [Build Errors](#build-errors)
- [Runtime Issues](#runtime-issues)
- [Platform-Specific Issues](#platform-specific-issues)

## Installation Issues

### Error: "failed to get cargo metadata: No such file or directory"

**Cause**: Cargo (Rust's package manager) is not installed or not in your PATH.

**Solution**:
1. Install Rust from https://rustup.rs/
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```
2. Restart your terminal
3. Verify installation: `cargo --version`

### Error: "npm: command not found"

**Cause**: Node.js is not installed.

**Solution**:
1. Install Node.js 18+ from https://nodejs.org/
2. Verify installation: `node --version` and `npm --version`

### Error: "failed to get `docx-rs`" or "403 Access Denied" from crates.io

**Cause**: Network restrictions or firewall blocking access to crates.io.

**Solutions**:
1. Check your internet connection
2. Check if your firewall or antivirus is blocking Cargo
3. Try using a VPN if your region/network restricts access
4. Check corporate proxy settings:
   ```bash
   # Set proxy for Cargo (if behind corporate proxy)
   export HTTPS_PROXY=http://proxy.example.com:8080
   ```
5. Use a mirror (China users):
   ```bash
   # Edit ~/.cargo/config.toml or .cargo/config.toml in project
   [source.crates-io]
   replace-with = 'ustc'

   [source.ustc]
   registry = "https://mirrors.ustc.edu.cn/crates.io-index"
   ```

## Build Errors

### Error: "tauri-build not found" or similar build dependency errors

**Cause**: Rust dependencies not downloaded.

**Solution**:
```bash
cd src-tauri
cargo fetch  # Download all dependencies
cargo build  # Build the project
cd ..
```

### Error: "webkit2gtk not found" (Linux)

**Cause**: Missing system dependencies on Linux.

**Solution (Ubuntu/Debian)**:
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

**Solution (Fedora)**:
```bash
sudo dnf install webkit2gtk3-devel \
    openssl-devel \
    curl \
    wget \
    gtk3-devel \
    libappindicator-gtk3-devel \
    librsvg2-devel
```

**Solution (Arch)**:
```bash
sudo pacman -S webkit2gtk \
    base-devel \
    curl \
    wget \
    openssl \
    gtk3 \
    libappindicator-gtk3 \
    librsvg
```

### Error: "Microsoft Visual C++ Build Tools required" (Windows)

**Cause**: Missing C++ build tools on Windows.

**Solution**:
1. Download and install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. During installation, select "Desktop development with C++"
3. Restart your terminal

### Error: "WebView2 not found" (Windows)

**Cause**: WebView2 runtime not installed.

**Solution**:
1. Download the [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
2. Install the Evergreen Bootstrapper
3. Restart your computer

### Error: "Xcode Command Line Tools required" (macOS)

**Cause**: Missing Xcode tools on macOS.

**Solution**:
```bash
xcode-select --install
```

## Runtime Issues

### Application window doesn't open

**Possible causes and solutions**:

1. **Port already in use** (development mode):
   - Check if port 1420 is already in use
   - Kill the process using that port
   - Change the port in `vite.config.ts` if needed

2. **Graphics driver issues**:
   - Update your graphics drivers
   - Try running with software rendering:
     ```bash
     LIBGL_ALWAYS_SOFTWARE=1 npm run tauri dev  # Linux
     ```

### Error: "Failed to save document"

**Possible causes**:

1. **Permission denied**:
   - Check if you have write permissions to the target directory
   - Try saving to a different location (Documents, Desktop, etc.)

2. **Invalid file path**:
   - Make sure the file path doesn't contain invalid characters
   - Use the file dialog instead of typing paths manually

### Document formatting not preserved when opening

**Expected behavior**: Currently, complex formatting features (tables, images, complex styles) are not fully supported. The app focuses on basic text formatting.

**Workaround**: Use this app for documents with simple formatting, or contribute to enhance the docx-rs integration!

## Platform-Specific Issues

### Linux: "Failed to load module 'canberra-gtk-module'"

**Cause**: Missing GTK sound theme module (harmless warning).

**Solution (optional)**:
```bash
sudo apt install libcanberra-gtk-module libcanberra-gtk3-module
```

### macOS: "App is damaged and can't be opened"

**Cause**: Gatekeeper blocking unsigned app.

**Solution**:
```bash
xattr -cr /path/to/Gemini\ Word.app
```

### Windows: "Windows protected your PC" warning

**Cause**: Unsigned application from unknown publisher.

**Solution**:
1. Click "More info"
2. Click "Run anyway"
3. (For distribution) Sign the app with a code signing certificate

## Still Having Issues?

If you're still experiencing problems:

1. **Check the logs**:
   - Development mode: Check terminal output
   - Production: Check application logs in:
     - Linux: `~/.local/share/com.gemini.word/logs/`
     - macOS: `~/Library/Logs/com.gemini.word/`
     - Windows: `%APPDATA%\com.gemini.word\logs\`

2. **Clean rebuild**:
   ```bash
   # Clean all build artifacts
   rm -rf node_modules
   rm -rf src-tauri/target
   npm install
   npm run tauri build
   ```

3. **Check versions**:
   ```bash
   node --version    # Should be 18+
   npm --version     # Should be 9+
   cargo --version   # Should be 1.70+
   rustc --version   # Should be 1.70+
   ```

4. **Open an issue**:
   - Go to the project's GitHub repository
   - Search existing issues first
   - Create a new issue with:
     - Your operating system and version
     - Node.js and Rust versions
     - Complete error message
     - Steps to reproduce

## Getting Help

- Check the [README.md](README.md) for general documentation
- Review [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute
- Open an issue on GitHub for bug reports
- Check Tauri documentation: https://tauri.app/
- Check docx-rs documentation: https://github.com/bokuweb/docx-rs
