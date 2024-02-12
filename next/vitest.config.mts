// vitest.config.ts
// https://github.com/vercel/next.js/blob/canary/examples/with-vitest/vitest.config.ts

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./*"),
    },
  },
});
