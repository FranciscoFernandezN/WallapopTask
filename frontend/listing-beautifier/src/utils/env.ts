function requireEnv(value: string | undefined, key: string): string {
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  backendHost: requireEnv(__ENV_BACKEND_HOST__, 'BACKEND_HOST'),
  backendPort: Number.parseInt(requireEnv(__ENV_BACKEND_PORT__, 'BACKEND_PORT'), 10),
  backendTimeout: Number.parseInt(requireEnv(__ENV_BACKEND_TIMEOUT__, 'BACKEND_TIMEOUT'), 10),
  frontendPort: Number.parseInt(requireEnv(__ENV_FRONTEND_PORT__, 'FRONTEND_PORT'), 10),
} as const;

export function getBackendUrl(): string {
  return `http://${env.backendHost}:${env.backendPort}`;
}
