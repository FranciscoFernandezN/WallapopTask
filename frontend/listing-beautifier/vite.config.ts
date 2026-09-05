import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, resolve(import.meta.dirname, '../..'), '');

  return defineConfig({
    plugins: [react()],
    define: {
      __ENV_BACKEND_PORT__: JSON.stringify(env.BACKEND_PORT),
      __ENV_BACKEND_HOST__: JSON.stringify(env.BACKEND_HOST),
      __ENV_BACKEND_TIMEOUT__: JSON.stringify(env.BACKEND_TIMEOUT),
      __ENV_FRONTEND_PORT__: JSON.stringify(env.FRONTEND_PORT),
    },
  });
});
