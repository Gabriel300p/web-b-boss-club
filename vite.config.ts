import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // 🚀 Bundle analyzer - only in analysis mode
    ...(process.env.ANALYZE
      ? [
          visualizer({
            filename: "dist/stats.html",
            open: true,
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@features": path.resolve(__dirname, "./src/features"),
    },
  },
  // 🚀 Dependency optimization
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@tanstack/react-router",
      "@tanstack/react-query",
      "zustand",
    ],
    exclude: ["@tanstack/router-devtools", "@tanstack/react-query-devtools"],
  },
  // 🚀 Remove console.logs in production
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  build: {
    // 🚀 Build optimizations
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // 🚀 Core React Dependencies
          "react-vendor": ["react", "react-dom"],

          // 🚀 Router & Navigation
          "router-vendor": ["@tanstack/react-router"],

          // 🚀 Data Fetching & State Management
          "query-vendor": ["@tanstack/react-query"],
          "state-vendor": ["zustand"],

          // 🚀 UI Component Libraries
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-slot",
          ],

          // 🚀 Form Handling & Validation
          "forms-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],

          // 🚀 Icons & Graphics
          "icons-vendor": ["@phosphor-icons/react", "lucide-react"],

          // 🚀 Utilities & Date Handling
          "utils-vendor": ["clsx", "class-variance-authority", "date-fns"],

          // 🚀 Table functionality
          "table-vendor": ["@tanstack/react-table"],
        },
        // 🚀 Better chunk naming for debugging
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name?.includes("vendor")) {
            return "assets/vendors/[name]-[hash].js";
          }
          if (chunkInfo.name?.includes("features")) {
            return "assets/features/[name]-[hash].js";
          }
          return "assets/chunks/[name]-[hash].js";
        },
      },
      // 🚀 Tree-shaking optimizations
      treeshake: {
        preset: "recommended",
        moduleSideEffects: false,
      },
    },
    // 🚀 Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true,
  },
});
