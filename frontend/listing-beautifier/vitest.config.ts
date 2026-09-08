import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    __ENV_BACKEND_PORT__: JSON.stringify('3000'),
    __ENV_BACKEND_HOST__: JSON.stringify('localhost'),
    __ENV_BACKEND_TIMEOUT__: JSON.stringify('30000'),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setup.ts'],
  },
});
