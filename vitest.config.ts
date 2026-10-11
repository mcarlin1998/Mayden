import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "."),
    },
  },
  test: {
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    // The page is an interactive component, so it needs a DOM to render into.
    environment: "jsdom",
    // Lets Testing Library clean up between tests automatically, without a
    // separate setup file.
    globals: true,
  },
});