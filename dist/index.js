#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_commander = require("commander");

// src/config.ts
var os = __toESM(require("os"));
var path = __toESM(require("path"));
var CONFIG = {
  CLI_COMMAND_NAME: "envmanager",
  API_URL: "http://localhost:3799",
  // API_URL: "https://api-envmanager.yolosopher.site",
  CONFIG_DIR: path.join(os.homedir(), ".env-manager"),
  TOKEN_FILE: path.join(os.homedir(), ".env-manager", "token.json")
};
var config_default = CONFIG;

// src/index.ts
var fs = __toESM(require("fs"));
var path2 = __toESM(require("path"));
var import_axios = __toESM(require("axios"));
var program = new import_commander.Command();
var showProject = (project) => {
  console.log("Project:", project);
  console.table({
    id: project.id,
    name: project.name
  });
};
if (!fs.existsSync(config_default.CONFIG_DIR)) {
  fs.mkdirSync(config_default.CONFIG_DIR, { recursive: true });
}
var api = import_axios.default.create({
  baseURL: config_default.API_URL
});
api.interceptors.request.use((config) => {
  try {
    if (fs.existsSync(config_default.TOKEN_FILE)) {
      const { token } = JSON.parse(fs.readFileSync(config_default.TOKEN_FILE, "utf8"));
      config.headers["x-api-token"] = token;
    }
  } catch (error) {
    console.error("Error reading token file");
  }
  return config;
});
program.name(config_default.CLI_COMMAND_NAME).description("CLI tool for managing environment variables").version("1.0.0");
var tokenCommand = program.command("token").description("Manage API token");
tokenCommand.command("set <token>").description("Set API token").action((token) => {
  console.log("Setting token:", token);
  fs.writeFileSync(config_default.TOKEN_FILE, JSON.stringify({ token }));
  console.log("Token saved successfully");
});
tokenCommand.command("remove").description("Remove stored token").action(() => {
  if (fs.existsSync(config_default.TOKEN_FILE)) {
    fs.unlinkSync(config_default.TOKEN_FILE);
    console.log("Token removed successfully");
  } else {
    console.log("No token found to remove");
  }
});
tokenCommand.command("show").description("Display current token").action(() => {
  if (fs.existsSync(config_default.TOKEN_FILE)) {
    const { token } = JSON.parse(fs.readFileSync(config_default.TOKEN_FILE, "utf8"));
    console.log("Current token:", token);
  } else {
    console.log("No token stored");
  }
});
var projectCommand = program.command("project").description("Manage projects");
projectCommand.command("list").description("List all projects").action(async () => {
  var _a;
  try {
    const response = await api.get("/cli/project");
    console.table(
      response.data.data.map((project) => ({
        id: project.id,
        name: project.name,
        environments: project.environments.map((env) => env.name).join(", ")
      }))
    );
  } catch (error) {
    console.error(
      "Error fetching projects:",
      ((_a = error.response) == null ? void 0 : _a.data) || error.message
    );
  }
});
projectCommand.command("find <name>").description("Find a project by name").action(async (name) => {
  var _a, _b;
  try {
    const response = await api.get(
      `/cli/project/${encodeURIComponent(name)}`
    );
    showProject(response.data);
  } catch (error) {
    if (((_a = error.response) == null ? void 0 : _a.status) === 404) {
      console.error("Project not found");
    } else {
      console.error(
        "Error finding project:",
        ((_b = error.response) == null ? void 0 : _b.data) || error.message
      );
    }
  }
});
projectCommand.command("create <name>").description("Create a new project").action(async (name) => {
  var _a;
  try {
    const response = await api.post("/cli/project", { name });
    console.log("Project created successfully:");
    console.table(response.data);
  } catch (error) {
    console.error(
      "Error creating project:",
      ((_a = error.response) == null ? void 0 : _a.data) || error.message
    );
  }
});
projectCommand.command("delete <name>").description("Delete a project by name").action(async (name) => {
  var _a, _b;
  try {
    await api.delete(`/cli/project/${encodeURIComponent(name)}`);
    console.log("Project deleted successfully");
  } catch (error) {
    if (((_a = error.response) == null ? void 0 : _a.status) === 404) {
      console.error("Project not found");
    } else {
      console.error(
        "Error deleting project:",
        ((_b = error.response) == null ? void 0 : _b.data) || error.message
      );
    }
  }
});
var environmentCommand = program.command("environment").description("Manage environments");
environmentCommand.command("list <projectName>").description("List all environments for a project").action(async (projectName) => {
  var _a, _b;
  try {
    const response = await api.get(
      `/cli/environment/${encodeURIComponent(projectName)}`
    );
    console.table(
      response.data.map((env) => ({
        id: env.id,
        name: env.name,
        projectName
      }))
    );
  } catch (error) {
    if (((_a = error.response) == null ? void 0 : _a.status) === 404) {
      console.error("Project not found");
    } else {
      console.error(
        "Error fetching environments:",
        ((_b = error.response) == null ? void 0 : _b.data) || error.message
      );
    }
  }
});
var parseEnvFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const variables = {};
    content.split("\n").forEach((line) => {
      if (!line || line.startsWith("#")) return;
      const [key, ...valueParts] = line.split("=");
      if (!key || valueParts.length === 0) return;
      const value = valueParts.join("=");
      const cleanKey = key.trim();
      let cleanValue = value.trim();
      if (cleanValue.startsWith('"') && cleanValue.endsWith('"') || cleanValue.startsWith("'") && cleanValue.endsWith("'")) {
        cleanValue = cleanValue.slice(1, -1);
      }
      if (cleanKey) {
        variables[cleanKey] = cleanValue;
      }
    });
    return variables;
  } catch (error) {
    throw new Error(`Error parsing env file: ${error.message}`);
  }
};
environmentCommand.command("create <projectName> [name]").description(
  "Create a new environment (name is optional, will use .env filename if not provided)"
).requiredOption("-e, --env <path>", "Path to .env file with variables").action(async (projectName, name, options) => {
  var _a, _b;
  try {
    const variables = parseEnvFile(options.env);
    const envName = name || path2.basename(options.env, path2.extname(options.env));
    console.log("Parsed variables:");
    console.table(variables);
    const response = await api.post("/cli/environment", {
      projectName,
      name: envName,
      variables
    });
    console.log("Environment created successfully:");
    console.table({
      name: response.data.name,
      projectName
    });
    console.table(variables);
  } catch (error) {
    if (error.message.startsWith("Error parsing env file:")) {
      console.error(error.message);
    } else if (((_a = error.response) == null ? void 0 : _a.status) === 404) {
      console.error("Project not found with the given name");
    } else {
      console.error(
        "Error creating environment:",
        ((_b = error.response) == null ? void 0 : _b.data) || error.message
      );
    }
  }
});
environmentCommand.command("delete <name>").description("Delete an environment by name").action(async (name) => {
  var _a, _b;
  try {
    await api.delete(`/cli/environment/${encodeURIComponent(name)}`);
    console.log("Environment deleted successfully");
  } catch (error) {
    if (((_a = error.response) == null ? void 0 : _a.status) === 404) {
      console.error("Environment not found");
    } else {
      console.error(
        "Error deleting environment:",
        ((_b = error.response) == null ? void 0 : _b.data) || error.message
      );
    }
  }
});
environmentCommand.command("download <projectName> <environmentName>").description("Download environment variables to a .env file").option(
  "-f, --file <filename>",
  "Output file name (default: <environment-name>.env)"
).action(async (projectName, environmentName, options) => {
  var _a, _b;
  try {
    const projectResponse = await api.get(
      `/cli/project/${encodeURIComponent(projectName)}`
    );
    const project = projectResponse.data;
    const environmentsResponse = await api.get(
      `/cli/environment/${encodeURIComponent(project.name)}`
    );
    const environments = environmentsResponse.data;
    const environment = environments.find(
      (env) => env.name === environmentName
    );
    if (!environment) {
      console.error(
        `Environment "${environmentName}" not found in project "${projectName}"`
      );
      return;
    }
    const variables = environment.variables;
    const envContent = Object.entries(variables).map(([key, value]) => `${key}=${value}`).join("\n");
    const outputFile = options.file || `${environmentName}.env`;
    fs.writeFileSync(outputFile, envContent);
    console.log(`Environment variables saved to ${outputFile}`);
  } catch (error) {
    if (((_a = error.response) == null ? void 0 : _a.status) === 404) {
      console.error("Project or environment not found");
    } else {
      console.error(
        "Error downloading environment:",
        ((_b = error.response) == null ? void 0 : _b.data) || error.message
      );
    }
  }
});
program.parse(process.argv);
