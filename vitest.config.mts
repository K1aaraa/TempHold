import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
  test: {
    environment: "jsdom", setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"], clearMocks: true, restoreMocks: true, maxWorkers: 2,
    coverage: {
      provider: "v8", include: ["components/**/*.{ts,tsx}", "lib/**/*.ts", "app/**/page.tsx", "app/not-found.tsx"],
      reporter: ["text", "html", "lcov", "json-summary"], reportsDirectory: "coverage",
      thresholds: { statements: 85, branches: 80, functions: 85, lines: 85 },
    },
  },
});
