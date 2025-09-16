// vitest.config.ts

import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["./src/test/setup-test-env.ts"],
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
    // Limpa todas as variáveis de ambiente e define apenas as necessárias para o teste
    clearMocks: true,
    environment: "node",
  },
  plugins: [tsconfigPaths()],
});
