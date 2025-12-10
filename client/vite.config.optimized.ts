import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  
  // Performance optimizations
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "wouter",
      "@tanstack/react-query",
      "zustand",
      "lucide-react"
    ],
    exclude: ["@radix-ui/*"] // Let these load on demand
  },
  
  build: {
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React bundle
          react: ["react", "react-dom"],
          // Router and state
          routing: ["wouter", "zustand"],
          // UI library
          radix: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs"
          ],
          // Data fetching
          query: ["@tanstack/react-query"],
          // Icons and animations
          ui: ["lucide-react", "framer-motion"]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  
  server: {
    host: "0.0.0.0",
    port: 5000,
    hmr: {
      overlay: false // Disable error overlay for better performance
    }
  }
});