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

## Usage

### Token Management

Before using any commands that interact with the API, you need to set your API token:

```bash
# Set your API token
envmanager token set <your-api-token>

# View current token
envmanager token show

# Remove stored token
envmanager token remove
```

### Project Management

```bash
# List all projects (shows ID, name, and associated environments)
envmanager project list

# Find a project by name
envmanager project find <n>

# Create a new project
envmanager project create <n>

# Delete a project
envmanager project delete <n>
```

### Environment Management

```bash
# List environments for a project (shows ID, name, and project)
envmanager environment list <project-name>

# Create a new environment from .env file
# Shows parsed variables before creation for verification
envmanager environment create <project-name> [env-name] -e ./env-file.env

# Examples:
envmanager environment create "my-project" "prod" -e ./prod.env     # Named environment
envmanager environment create "my-project" -e ./staging.env         # Uses "staging" as name

# Delete an environment (requires both project and environment names)
envmanager environment delete <project-name> <env-name>

# Download environment variables
envmanager environment download <project-name> <env-name>           # Downloads to <env-name>.env
envmanager environment download <project-name> <env-name> -f path   # Downloads to specified path
```

## Environment File Format

When creating environments, your .env file should follow the standard format:

```env
# Comments are supported and will be ignored
DATABASE_URL=postgresql://user:pass@localhost:5432/db
API_KEY=your-api-key

# Values can contain equals signs
COMPLEX_VALUE=key=value=something

# Values can be quoted (quotes will be removed)
SECRET="my secret value"
OTHER_SECRET='another secret'

# Empty lines are ignored
```

## Token Storage Location

Your API token is stored securely in:
- macOS/Linux: `~/.env-manager/token.json`
- Windows: `%USERPROFILE%\.env-manager\token.json`

## Error Handling

The CLI provides clear error messages for common scenarios:
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

# Run tests (if implemented)
npm test

# Link for local development
npm link
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 