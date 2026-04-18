import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Avoid picking up ../postcss.config.js (Tailwind) when building inside the monorepo
  css: {
    postcss: {
      plugins: [],
    },
  },
});
