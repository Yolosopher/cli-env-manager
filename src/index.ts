#!/usr/bin/env node

import { Command } from "commander";
import CONFIG from "./config";
import * as fs from "fs";
import * as path from "path";
import axios from "axios";

const program = new Command();

const showProject = (project: any) => {
  console.log("Project:", project);
  console.table({
    id: project.id,
    name: project.name,
  });
};

// Ensure config directory exists
if (!fs.existsSync(CONFIG.CONFIG_DIR)) {
  fs.mkdirSync(CONFIG.CONFIG_DIR, { recursive: true });
}

// Initialize axios instance
const api = axios.create({
  baseURL: CONFIG.API_URL,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  try {
    if (fs.existsSync(CONFIG.TOKEN_FILE)) {
      const { token } = JSON.parse(fs.readFileSync(CONFIG.TOKEN_FILE, "utf8"));
      config.headers["x-api-token"] = token;
    }
  } catch (error) {
    console.error("Error reading token file");
  }
  return config;
});

program
  .name(CONFIG.CLI_COMMAND_NAME)
  .description("CLI tool for managing environment variables")
  .version("1.0.0");

const tokenCommand = program.command("token").description("Manage API token");

tokenCommand
  .command("set <token>")
  .description("Set API token")
  .action((token) => {
    console.log("Setting token:", token);
    fs.writeFileSync(CONFIG.TOKEN_FILE, JSON.stringify({ token }));
    console.log("Token saved successfully");
  });

tokenCommand
  .command("remove")
  .description("Remove stored token")
  .action(() => {
    if (fs.existsSync(CONFIG.TOKEN_FILE)) {
      fs.unlinkSync(CONFIG.TOKEN_FILE);
      console.log("Token removed successfully");
    } else {
      console.log("No token found to remove");
    }
  });

tokenCommand
  .command("show")
  .description("Display current token")
  .action(() => {
    if (fs.existsSync(CONFIG.TOKEN_FILE)) {
      const { token } = JSON.parse(fs.readFileSync(CONFIG.TOKEN_FILE, "utf8"));
      console.log("Current token:", token);
    } else {
      console.log("No token stored");
    }
  });

const projectCommand = program
  .command("project")
  .description("Manage projects");

projectCommand
  .command("list")
  .description("List all projects")
  .action(async () => {
    try {
      const response = await api.get("/cli/project");
      console.table(
        response.data.data.map((project: any) => ({
          id: project.id,
          name: project.name,
          environments: project.environments
            .map((env: any) => env.name)
            .join(", "),
        }))
      );
    } catch (error: any) {
      console.error(
        "Error fetching projects:",
        error.response?.data || error.message
      );
    }
  });

projectCommand
  .command("find <name>")
  .description("Find a project by name")
  .action(async (name) => {
    try {
      const response = await api.get(
        `/cli/project/${encodeURIComponent(name)}`
      );
      showProject(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.error("Project not found");
      } else {
        console.error(
          "Error finding project:",
          error.response?.data || error.message
        );
      }
    }
  });

projectCommand
  .command("create <name>")
  .description("Create a new project")
  .action(async (name) => {
    try {
      const response = await api.post("/cli/project", { name });
      console.log("Project created successfully:");
      console.table(response.data);
    } catch (error: any) {
      console.error(
        "Error creating project:",
        error.response?.data || error.message
      );
    }
  });

projectCommand
  .command("delete <name>")
  .description("Delete a project by name")
  .action(async (name) => {
    try {
      await api.delete(`/cli/project/${encodeURIComponent(name)}`);
      console.log("Project deleted successfully");
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.error("Project not found");
      } else {
        console.error(
          "Error deleting project:",
          error.response?.data || error.message
        );
      }
    }
  });

const environmentCommand = program
  .command("environment")
  .description("Manage environments");

environmentCommand
  .command("list <projectName>")
  .description("List all environments for a project")
  .action(async (projectName) => {
    try {
      const response = await api.get(
        `/cli/environment/${encodeURIComponent(projectName)}`
      );
      console.table(
        response.data.map((env: any) => ({
          id: env.id,
          name: env.name,
          projectName,
        }))
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.error("Project not found");
      } else {
        console.error(
          "Error fetching environments:",
          error.response?.data || error.message
        );
      }
    }
  });

// Add this helper function to parse .env files
const parseEnvFile = (filePath: string): Record<string, string> => {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const variables: Record<string, string> = {};

    content.split("\n").forEach((line) => {
      // Skip comments and empty lines
      if (!line || line.startsWith("#")) return;

      // Split on first = only
      const [key, ...valueParts] = line.split("=");
      if (!key || valueParts.length === 0) return;

      const value = valueParts.join("="); // Rejoin in case value contains =

      // Clean up key and value
      const cleanKey = key.trim();
      let cleanValue = value.trim();

      // Remove quotes if they exist
      if (
        (cleanValue.startsWith('"') && cleanValue.endsWith('"')) ||
        (cleanValue.startsWith("'") && cleanValue.endsWith("'"))
      ) {
        cleanValue = cleanValue.slice(1, -1);
      }

      if (cleanKey) {
        variables[cleanKey] = cleanValue;
      }
    });

    return variables;
  } catch (error: any) {
    throw new Error(`Error parsing env file: ${error.message}`);
  }
};

environmentCommand
  .command("create <projectName> [name]")
  .description(
    "Create a new environment (name is optional, will use .env filename if not provided)"
  )
  .requiredOption("-e, --env <path>", "Path to .env file with variables")
  .action(async (projectName, name, options) => {
    try {
      // Parse the env file
      const variables = parseEnvFile(options.env);

      // If name is not provided, use the filename without extension
      const envName =
        name || path.basename(options.env, path.extname(options.env));

      console.log("Parsed variables:");
      console.table(variables);

      const response = await api.post("/cli/environment", {
        projectName,
        name: envName,
        variables,
      });

      console.log("Environment created successfully:");
      console.table({
        name: response.data.name,
        projectName,
      });
      console.table(variables);
    } catch (error: any) {
      if (error.message.startsWith("Error parsing env file:")) {
        console.error(error.message);
      } else if (error.response?.status === 404) {
        console.error("Project not found with the given name");
      } else {
        console.error(
          "Error creating environment:",
          error.response?.data || error.message
        );
      }
    }
  });

environmentCommand
  .command("delete <projectName> <envName>")
  .description("Delete an environment by project name and environment name")
  .action(async (projectName, envName) => {
    try {
      await api.delete(
        `/cli/environment/${encodeURIComponent(
          projectName
        )}/${encodeURIComponent(envName)}`
      );
      console.log("Environment deleted successfully");
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.error("Project or environment not found");
      } else {
        console.error(
          "Error deleting environment:",
          error.response?.data || error.message
        );
      }
    }
  });

environmentCommand
  .command("download <projectName> <environmentName>")
  .description("Download environment variables to a .env file")
  .option(
    "-f, --file <filename>",
    "Output file name (default: <environment-name>.env)"
  )
  .action(async (projectName, environmentName, options) => {
    try {
      // First get the environment ID using the project name and environment name
      const projectResponse = await api.get(
        `/cli/project/${encodeURIComponent(projectName)}`
      );
      const project = projectResponse.data as {
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
        userId: string;
      };

      const environmentsResponse = await api.get(
        `/cli/environment/${encodeURIComponent(project.name)}`
      );
      const environments = environmentsResponse.data;
      const environment = environments.find(
        (env: any) => env.name === environmentName
      );
      if (!environment) {
        console.error(
          `Environment "${environmentName}" not found in project "${projectName}"`
        );
        return;
      }

      const variables = environment.variables;

      // Create .env file content
      const envContent = Object.entries(variables)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");

      // Determine output file name
      const outputFile = options.file || `${environmentName}.env`;

      // Write to file
      fs.writeFileSync(outputFile, envContent);
      console.log(`Environment variables saved to ${outputFile}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.error("Project or environment not found");
      } else {
        console.error(
          "Error downloading environment:",
          error.response?.data || error.message
        );
      }
    }
  });

program.parse(process.argv);
