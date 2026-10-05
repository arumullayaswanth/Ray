import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Build output goes to ../static so FastAPI (app.py) serves it directly.
// During dev, /chat and /healthz are proxied to the local Ray Serve app.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../backend/static",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep the heavy syntax highlighter in its own cacheable chunk.
          highlighter: ["react-syntax-highlighter"],
          markdown: ["react-markdown", "remark-gfm"],
          react: ["react", "react-dom"],
        },
      },
    },
  },
  server: {
    proxy: {
      "/chat": "http://localhost:8000",
      "/healthz": "http://localhost:8000",
      "/ready": "http://localhost:8000",
    },
  },
});
