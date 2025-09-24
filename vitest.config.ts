import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/modules/**/*.ts"],
      exclude: [
        "src/modules/**/repositories/prisma/*",
        "src/modules/**/factories/*",
        "src/modules/**/errors/*",
        "src/**/I-*-repository.ts",
      ],
    },
  },
});
