import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  base: "/kothok-site/",
  plugins: [react(), cloudflare()],
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1200,
  },
});