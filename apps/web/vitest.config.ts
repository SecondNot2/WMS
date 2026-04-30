import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/.next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: [
        "src/server/lib/**/*.ts",
        "src/server/services/**/*.ts",
        "src/lib/**/*.ts",
      ],
      exclude: [
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "src/lib/api/**",
        "src/lib/hooks/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@wms/types": path.resolve(__dirname, "../../packages/types/src"),
      "@wms/validations": path.resolve(
        __dirname,
        "../../packages/validations/src",
      ),
      "@wms/config": path.resolve(__dirname, "../../packages/config/src"),
    },
  },
});
