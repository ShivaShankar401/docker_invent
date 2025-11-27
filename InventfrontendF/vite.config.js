import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/inventory_management/',
  server: {
    port: 5173,
    open: false,
    proxy: {
      // Forward API requests to the backend server
      '/api': {
        target: 'http://localhost:7090',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 5173,
  },
});
