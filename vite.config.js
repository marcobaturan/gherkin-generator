import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite configuration for the Gherkin Test Case Generator.
 *
 * The proxy redirects /api requests to a local Express-like
 * mock during development. In production (Vercel), the /api
 * folder is served as serverless functions automatically.
 */
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
    },
});
