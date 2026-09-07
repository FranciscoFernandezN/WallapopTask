/**
 * Reads a required Vite-injected environment variable or throws if missing/empty.
 *
 * @param value - The injected global constant value.
 * @param key - Name of the original environment variable (for error messages).
 * @returns The string value.
 * @throws {Error} When the value is undefined or empty.
 */
function requireEnv(value: string | undefined, key: string): string {
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Parsed frontend environment configuration.
 *
 * Values are injected at build time by Vite via `define` in `vite.config.ts`.
 */
export const env = {
  /** Hostname of the backend API server. */
  backendHost: requireEnv(__ENV_BACKEND_HOST__, 'BACKEND_HOST'),
  /** Port of the backend API server. */
  backendPort: Number.parseInt(requireEnv(__ENV_BACKEND_PORT__, 'BACKEND_PORT'), 10),
  /** Timeout in milliseconds for backend API requests. */
  backendTimeout: Number.parseInt(requireEnv(__ENV_BACKEND_TIMEOUT__, 'BACKEND_TIMEOUT'), 10),
  /** Port the frontend dev server runs on. */
  frontendPort: Number.parseInt(requireEnv(__ENV_FRONTEND_PORT__, 'FRONTEND_PORT'), 10),
} as const;

/**
 * Builds the full backend API base URL.
 *
 * @returns A URL string in the form `http://{host}:{port}`.
 */
export function getBackendUrl(): string {
  return `http://${env.backendHost}:${env.backendPort}`;
}
