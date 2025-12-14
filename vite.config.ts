import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // pisahkan vendor biar chunk utama lebih kecil
          if (id.includes("node_modules")) {
            if (id.includes("react-router")) return "router";
            return "vendor";
          }
        },
      },
    },
    // (opsional) kalau kamu mau naikin batas warning
    // chunkSizeWarningLimit: 800,
  },
}));
