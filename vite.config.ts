import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    // Target modern browsers — smaller output
    target: "es2020",

    // Increase chunk warning limit
    chunkSizeWarningLimit: 1000,

    // Minify with esbuild (faster than terser, good enough)
    minify: "esbuild",

    // CSS code splitting
    cssCodeSplit: true,

    // Rollup options for manual chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor: React core
          "vendor-react": ["react", "react-dom"],

          // Vendor: Router
          "vendor-router": ["react-router-dom"],

          // Vendor: Animations (large — split out)
          "vendor-motion": ["framer-motion"],

          // Vendor: Icons (large — split out)
          "vendor-icons": ["lucide-react"],

          // Vendor: Helmet
          "vendor-helmet": ["react-helmet-async"],

          // Vendor: Utilities
          "vendor-utils": ["clsx", "tailwind-merge", "class-variance-authority"],
        },

        // Asset file naming
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? "";
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(name)) {
            return "assets/images/[name]-[hash][extname]";
          }
          if (/\.css$/i.test(name)) {
            return "assets/css/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },

        // Chunk file naming
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
  },

  // Optimize deps pre-bundling
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "lucide-react",
    ],
  },
});
