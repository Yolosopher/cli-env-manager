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

## Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install

# Build the project
npm run build

# Link the CLI globally (optional)
npm link
```

## Configuration

The CLI can be configured using environment variables:

```bash
API_URL=http://your-api-url    # Default: http://localhost:3000
CLI_COMMAND_NAME=customname    # Default: envmanager
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
# List all projects (shows id and name)
envmanager project list

# Find a project by name
envmanager project find "Project Name"

# Create a new project
envmanager project create "My New Project"

# Delete a project by name
envmanager project delete "Project Name"
```

### Environment Management

```bash
# List environments for a project (shows id, name, and variables)
envmanager environment list "Project Name"

# Create a new environment with variables from .env file
envmanager environment create "Project Name" "Environment Name" -e path/to/.env
envmanager environment create "Project Name" -e production.env              # Will create "production" environment
envmanager environment create "Project Name" -e ./config/staging.env       # Will create "staging" environment

# Delete an environment by name
envmanager environment delete "Environment Name"

# Download environment variables to a .env file
envmanager environment download "Project Name" "Environment Name"
envmanager environment download "Project Name" "Environment Name" -f custom.env
```

#### Creating Environments with Variables

When creating a new environment, you need to provide a .env file containing the environment variables. The environment name is optional - if not provided, the CLI will use the .env file's name (without extension) as the environment name.

The file should follow the standard .env format:

```env
# Example .env file
DATABASE_URL=postgresql://user:pass@localhost:5432/db
API_KEY=your-api-key
NODE_ENV=production
# Lines starting with # are ignored
KEY_WITH_EQUALS=value=with=equals=signs
```

Examples:
```bash
# Specify environment name explicitly
envmanager environment create "My Project" "Production" -e ./prod.env

# Use file name as environment name
envmanager environment create "My Project" -e ./production.env     # Creates "production" environment
envmanager environment create "My Project" -e staging.env          # Creates "staging" environment
envmanager environment create "My Project" -e ./config/dev.env    # Creates "dev" environment
```

#### Downloading Environment Variables

You can download environment variables to a .env file using the download command. By default, it will create a file named `<environment-name>.env` in the current directory. You can specify a custom filename using the `-f` or `--file` option:

```bash
# Download to default filename (Production.env)
envmanager environment download "My Project" "Production"

# Download to custom filename
envmanager environment download "My Project" "Production" -f ./config/prod.env
```

## Token Storage

Your API token is stored securely in:
- macOS/Linux: `~/.env-manager/token.json`
- Windows: `%USERPROFILE%\.env-manager\token.json`

## Development

```bash
# Build the project
npm run build

# Run in development mode
npm start
```

## License

MIT 