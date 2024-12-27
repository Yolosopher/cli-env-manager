import "dotenv/config";
import * as os from 'os';
import * as path from 'path';

const CONFIG = {
  CLI_COMMAND_NAME: process.env.CLI_COMMAND_NAME || 'envmanager',
  API_URL: process.env.API_URL || 'http://localhost:3799',
  CONFIG_DIR: path.join(os.homedir(), '.env-manager'),
  TOKEN_FILE: path.join(os.homedir(), '.env-manager', 'token.json'),
};

export default CONFIG;
