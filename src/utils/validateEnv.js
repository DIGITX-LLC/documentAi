import { REQUIRED_ENV_VARS, ERROR_MESSAGES } from '../config/constants.js';

export function validateEnvironment() {
  const missingVars = REQUIRED_ENV_VARS.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(ERROR_MESSAGES.MISSING_ENV_VARS(missingVars));
  }
}