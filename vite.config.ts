import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/kothok-site/",
  plugins: [react()],
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1200,
  },
});
