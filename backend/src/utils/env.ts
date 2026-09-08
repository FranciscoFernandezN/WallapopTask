import * as fs from 'fs';

/**
 * Reads a required environment variable or throws if missing/empty.
 *
 * @param key - Name of the environment variable.
 * @returns The trimmed string value.
 * @throws {Error} When the variable is undefined or empty.
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Parsed and validated environment configuration.
 *
 * All values are read once at startup and frozen with `as const`.
 */
export const env = {
  /** Port the backend HTTP server listens on. */
  backendPort: Number.parseInt(requireEnv('BACKEND_PORT'), 10),
  /** Port the frontend dev server runs on (used for CORS origin). */
  frontendPort: Number.parseInt(requireEnv('FRONTEND_PORT'), 10),
  /** Hostname of the frontend (used for CORS origin). */
  frontendHost: requireEnv('FRONTEND_HOST'),
  /** API key for authenticating with the AI model provider. */
  aiModelProviderApiKey: requireEnv('AI_MODEL_PROVIDER_API_KEY'),
  /** Maximum time in milliseconds to wait for a single AI model response. */
  aiModelTimeout: Number.parseInt(requireEnv('AI_MODEL_TIMEOUT'), 10),
  /** Ordered list of AI model identifiers to try (comma-separated in env). */
  aiModelProviders: requireEnv('AI_MODEL_PROVIDER').split(',').map(p => p.trim()),
  /** Number of retry attempts per AI model before moving to the next provider. */
  maxRetries: Number.parseInt(requireEnv('AI_MAX_RETRIES'), 10),
} as const;

/**
 * Reads the system prompt used to instruct the AI model.
 *
 * @returns The raw text content of `./prompts/beautifier.txt`.
 */
export function loadPromptText(): string {
  return fs.readFileSync('./prompts/beautifier.txt', 'utf8');
}

/**
 * Builds the full frontend URL for CORS configuration.
 *
 * @returns A URL string in the form `http://{host}:{port}`.
 */
export function getFrontendUrl(): string {
  return `http://${env.frontendHost}:${env.frontendPort}`;
}
