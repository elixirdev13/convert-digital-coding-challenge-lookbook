import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The lookbook React app is bundled into a single JS + CSS asset that the
// theme loads from `theme/assets`. We intentionally do NOT clear the output
// directory so we never wipe other theme assets.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "theme/assets",
    emptyOutDir: false,
    cssCodeSplit: false,
    // Keep the bundle self-contained (React included) so it can run inside a
    // Liquid-rendered mount point without any import maps.
    rollupOptions: {
      input: "src/main.tsx",
      output: {
        format: "iife",
        entryFileNames: "lookbook.bundle.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "lookbook.bundle.css";
          }
          return "lookbook.[ext]";
        },
      },
    },
  },
});
