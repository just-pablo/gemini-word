# Contributing to Gemini Word

Thank you for your interest in contributing to Gemini Word! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Start development server: `npm run tauri dev`

## Code Style

### Rust
- Follow the official [Rust Style Guide](https://doc.rust-lang.org/beta/style-guide/)
- Run `cargo fmt` before committing
- Ensure `cargo clippy` passes without warnings

### TypeScript/React
- Use TypeScript for all new code
- Follow React best practices and hooks guidelines
- Use functional components over class components
- Keep components focused and single-responsibility

## Pull Request Process

1. Create a new branch from `main`: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test your changes thoroughly
4. Update documentation if needed
5. Commit with clear, descriptive messages
6. Push to your fork
7. Open a Pull Request with a clear description of changes

## Commit Message Guidelines

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests after the first line

Example:
```
Add table support to document editor

- Implement table creation UI
- Add table formatting options
- Update docx-rs integration for tables

Fixes #123
```

## Testing

- Test all changes manually in development mode
- Test the production build before submitting PR
- Verify cross-platform compatibility when possible

## Reporting Bugs

When reporting bugs, please include:
- Operating system and version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Error messages from console

## Feature Requests

Feature requests are welcome! Please:
- Check if the feature is already requested
- Provide clear use cases
- Explain why this feature would be useful
- Consider offering to implement it yourself

## Questions?

Feel free to open an issue for any questions about contributing!
