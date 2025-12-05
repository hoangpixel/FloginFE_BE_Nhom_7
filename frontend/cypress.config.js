import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // Set default env for API/FE base; allow override via system env
      const apiBase = process.env.CYPRESS_API_BASE || 'http://localhost:8080';
      const feBase = process.env.CYPRESS_FE_BASE || 'http://localhost:5173';
      config.env = { ...(config.env || {}), API_BASE: apiBase, FE_BASE: feBase };
      return config;
    },
  },
});