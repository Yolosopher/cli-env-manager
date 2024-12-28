# Environment Manager CLI

A command-line interface tool for managing environment variables across different projects and environments. This CLI tool interacts with the Environment Manager API to help you manage your projects and their environments efficiently.

## Features

- 🔑 API Token Management
- 📁 Project Management (Create, List, Find, Delete)
- 🌍 Environment Management (Create, List, Delete, Download)
- 🔒 Secure Token Storage
- 📝 .env File Support
- 🏷️ Project Name Support
- 🔄 Smart Environment Naming
- 📋 Variable Preview Before Creation

## Installation

```bash
# Install from npm (once published)
npm install -g @your-scope/env-manager-cli

# Or install from source:
git clone <your-repo-url>
cd env-manager-cli
npm install
npm run build
npm link
```

## Quick Start Guide

1. First, set up your API token:
```bash
envmanager token set <your-api-token>
```

2. Create a new project:
```bash
envmanager project create "my-project"
```

3. Create an environment from a .env file:
```bash
envmanager environment create "my-project" "prod" -e ./prod.env
```

## Command Reference

### Token Management
```bash
# Set your API token
envmanager token set <your-api-token>

# View current token
envmanager token show

# Remove token
envmanager token remove
```

### Project Commands
```bash
# List all projects
envmanager project list

# Find project by name
envmanager project find <name>

# Create project
envmanager project create <name>

# Delete project
envmanager project delete <name>
```

### Environment Commands
```bash
# List environments
envmanager environment list <project-name>

# Create environment
envmanager environment create <project-name> [env-name] -e ./file.env

# Delete environment
envmanager environment delete <project-name> <env-name>

# Download environment
envmanager environment download <project-name> <env-name>          # Saves as <env-name>.env
envmanager environment download <project-name> <env-name> -f path  # Saves to custom path
```

## Environment File Format

Your .env files should follow this format:
```env
# Comments are supported
DATABASE_URL=postgresql://user:pass@localhost:5432/db
API_KEY=your-api-key

# Values can contain equals signs
COMPLEX_VALUE=key=value=something

# Values can be quoted
SECRET="my secret value"
OTHER_SECRET='another secret'
```

## Token Storage

API tokens are stored securely in:
- macOS/Linux: `~/.env-manager/token.json`
- Windows: `%USERPROFILE%\.env-manager\token.json`

## Error Handling

The CLI provides clear error messages for:
- Invalid API token
- Project not found
- Environment not found
- Invalid .env file format
- Network connectivity issues

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Link for local development
npm link
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 