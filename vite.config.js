import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths avoid 404s across root, project pages and custom domains.
  base: "./",
  plugins: [react()],
});
