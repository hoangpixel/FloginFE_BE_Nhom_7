import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // Use FE_BASE as baseUrl so GUI/open uses the chosen origin
    setupNodeEvents(on, config) {
      const apiBase = process.env.CYPRESS_API_BASE || 'http://localhost:8080';
      const feBase = process.env.CYPRESS_FE_BASE || 'http://localhost:5173';
      config.env = { ...(config.env || {}), API_BASE: apiBase, FE_BASE: feBase };
      config.baseUrl = feBase;
      return config;
    },
  },
});