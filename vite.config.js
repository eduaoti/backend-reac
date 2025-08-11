//vite.config.js
/* eslint-env node */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname / __filename en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Lee version desde package.json (sin usar process)
const pkg = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8')
);

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version || 'dev'),
    // Si en tu front usas process.env por error, evita crasheos:
    'process.env': {},
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert/localhost.pem')),
    },
    host: 'localhost',
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://doinow-back-16-1.azurewebsites.net',
        changeOrigin: true,
        secure: true,
      },
      '/uploads': {
        target: 'https://doinow-back-16-1.azurewebsites.net',
        changeOrigin: true,
        secure: true,
      }
    }
    
  },
  // Vitest
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: { reporter: ['text', 'html'] }
  }
});
