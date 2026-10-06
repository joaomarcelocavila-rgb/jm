import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base "./" deixa o build funcionar em qualquer pasta (ex.: GitHub Pages).
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
