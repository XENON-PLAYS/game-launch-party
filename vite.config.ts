import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    target: "esnext",
    rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom") || id.includes("scheduler")) {
                return "vendor-core";
              }
              if (id.includes("@radix-ui") || id.includes("lucide-react") || id.includes("clsx") || id.includes("tailwind-merge")) {
                return "vendor-ui";
              }
              if (id.includes("framer-motion")) {
                return "vendor-animation";
              }
              if (id.includes("@tanstack/react-query") || id.includes("@supabase") || id.includes("zod")) {
                return "vendor-data";
              }
              return "vendor";
            }
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
    },
    chunkSizeWarningLimit: 800,
    cssCodeSplit: true,
    minify: "esbuild",
    sourcemap: false,
    reportCompressedSize: false,
    modulePreload: {
      polyfill: true
    }
  },
}));
