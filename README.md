# Gemini Word

A modern, feature-rich Word document editor built with Rust and React, powered by `docx-rs` for native .docx file handling.

## Features

- **Rich Text Editing**: Full-featured text editor with real-time formatting
- **Document Formatting**:
  - Bold, Italic, Underline text styles
  - Multiple font families (Calibri, Arial, Times New Roman, Georgia, Verdana, Courier New)
  - Font size selection (8pt - 72pt)
  - Text color customization
  - Text alignment (Left, Center, Right, Justify)
- **File Operations**:
  - Create new documents
  - Open existing .docx files
  - Save and Save As functionality
  - Native .docx format support via docx-rs
- **Professional UI**:
  - Modern, clean interface inspired by Microsoft Word
  - Intuitive toolbar with visual formatting controls
  - Page-like editing experience with proper margins
  - Status bar showing current file and app state
- **Cross-Platform**: Built with Tauri for native performance on Windows, macOS, and Linux

## Technology Stack

### Backend
- **Rust**: High-performance systems programming language
- **Tauri**: Lightweight desktop application framework
- **docx-rs**: Native Rust library for reading and writing .docx files
- **Serde**: Serialization/deserialization framework

### Frontend
- **React 18**: Modern UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Lucide React**: Beautiful icon library

## Prerequisites

Before building the application, ensure you have the following installed:

1. **Rust** (1.70+)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Node.js** (18+) and npm
   ```bash
   # Download from https://nodejs.org/
   # Or use a version manager like nvm
   ```

3. **Tauri Prerequisites**

   **Linux (Debian/Ubuntu)**:
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

   **macOS**:
   ```bash
   xcode-select --install
   ```

   **Windows**:
   - Install [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - Install [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd gemini-word
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install Tauri CLI** (if not already installed):
   ```bash
   npm install -g @tauri-apps/cli
   ```

## Development

Run the application in development mode:

```bash
npm run tauri dev
```

This will:
- Start the Vite dev server (frontend with hot reload)
- Build and run the Rust backend
- Launch the application window

## Building for Production

Create an optimized production build:

```bash
npm run tauri build
```

The built application will be available in `src-tauri/target/release/bundle/`:
- **Linux**: `.deb`, `.AppImage`
- **macOS**: `.dmg`, `.app`
- **Windows**: `.msi`, `.exe`

## Usage

### Creating a New Document
1. Click the "New" button in the menu bar
2. Start typing in the editor

### Opening a Document
1. Click the "Open" button
2. Select a `.docx` file from your file system
3. The document will be loaded into the editor

### Formatting Text
1. Select text in the editor
2. Use the toolbar buttons to apply formatting:
   - Font family dropdown
   - Font size dropdown
   - Bold, Italic, Underline buttons
   - Alignment buttons (Left, Center, Right, Justify)
   - Color picker for text color

### Saving a Document
1. Click "Save" to save to the current file
2. Click "Save As" to save to a new location
3. Choose a location and filename
4. The document is saved in .docx format

## Project Structure

```
gemini-word/
├── src/                    # React frontend source
│   ├── App.tsx            # Main application component
│   ├── App.css            # Application styles
│   ├── main.tsx           # React entry point
│   └── styles.css         # Global styles
├── src-tauri/             # Rust backend source
│   ├── src/
│   │   └── main.rs        # Tauri application & commands
│   ├── Cargo.toml         # Rust dependencies
│   ├── tauri.conf.json    # Tauri configuration
│   └── build.rs           # Build script
├── index.html             # HTML entry point
├── package.json           # Node.js dependencies
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

## Architecture

### Frontend (React/TypeScript)
- **App.tsx**: Main component managing editor state, formatting, and file operations
- **ContentEditable div**: Native browser contentEditable for text editing
- **Tauri API integration**: Calls Rust backend commands for file I/O

### Backend (Rust/Tauri)
- **create_new_document**: Initializes a new blank document
- **open_document**: Reads .docx file and parses content using docx-rs
- **save_document**: Converts editor content to .docx format and saves
- **File system access**: Secured through Tauri's permission system

### Data Flow
1. User interacts with React UI
2. Formatting applied via browser's execCommand API
3. Save operation extracts content from contentEditable
4. Content serialized to JSON and sent to Rust backend
5. docx-rs converts JSON to .docx format
6. File saved to disk via Tauri's secure file system API

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd + B | Bold |
| Ctrl/Cmd + I | Italic |
| Ctrl/Cmd + U | Underline |
| Ctrl/Cmd + L | Align Left |
| Ctrl/Cmd + E | Align Center |
| Ctrl/Cmd + R | Align Right |

## Limitations & Known Issues

1. **Complex Document Features**: Currently supports basic text formatting. Advanced features like tables, images, headers/footers are not yet implemented.
2. **Style Preservation**: When opening documents with complex styles, some formatting may be simplified.
3. **Undo/Redo**: Browser's native undo/redo is used (Ctrl/Cmd + Z, Ctrl/Cmd + Shift + Z).

## Future Enhancements

- [ ] Support for embedded images
- [ ] Tables and lists
- [ ] Headers and footers
- [ ] Page numbering
- [ ] Document templates
- [ ] Spell check
- [ ] Export to PDF
- [ ] Cloud storage integration
- [ ] Collaborative editing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Tauri](https://tauri.app/)
- Document processing powered by [docx-rs](https://github.com/bokuweb/docx-rs)
- Icons from [Lucide](https://lucide.dev/)
- UI inspired by Microsoft Word

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Made with Rust and React**
