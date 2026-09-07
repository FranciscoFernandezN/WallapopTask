import * as fs from 'fs';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  backendPort: Number.parseInt(requireEnv('BACKEND_PORT'), 10),
  frontendPort: Number.parseInt(requireEnv('FRONTEND_PORT'), 10),
  frontendHost: requireEnv('FRONTEND_HOST'),
  aiModelProviderBaseUrl: requireEnv('AI_MODEL_PROVIDER_BASE_URL'),
  aiModelProviderApiKey: requireEnv('AI_MODEL_PROVIDER_API_KEY'),
  aiModelTimeout: Number.parseInt(requireEnv('AI_MODEL_TIMEOUT'), 10),
  aiModelProvider: requireEnv('AI_MODEL_PROVIDER'),
  maxRetries: Number.parseInt(requireEnv('AI_MAX_RETRIES'), 10),
} as const;

export function loadPromptText(): string {
  return fs.readFileSync('./prompts/beautifier.txt', 'utf8');
}

export function getFrontendUrl(): string {
  return `http://${env.frontendHost}:${env.frontendPort}`;
}
