// Importa as configurações recomendadas do ESLint
import js from "@eslint/js";
// Importa as configurações recomendadas do TypeScript-ESLint
import tseslint from "typescript-eslint";
// Importa as variáveis globais do Node.js
import globals from "globals";
// Importa o plugin do Prettier para ESLint
import prettierPlugin from "eslint-plugin-prettier";
// Importa a configuração do Prettier para ESLint
import prettierConfig from "eslint-config-prettier";

export default [
  // A propriedade 'ignores' deve ser definida no início do array para arquivos e diretórios que devem ser excluídos.
  // Estes padrões são semelhantes aos de um arquivo .eslintignore.
  // A forma correta, esperada pelo Prettier
  { ignores: ["dist/", "node_modules/", "*.test.ts", "build/", "coverage/",]},

  // Define as regras para arquivos JavaScript e TypeScript
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    // Habilita as variáveis globais do Node.js
    languageOptions: {
      globals: {
        // Usa o objeto `globals` importado para incluir as variáveis de ambiente
        ...globals.node,
        ...globals.es2021,
      },
    },
    // Adiciona as regras básicas e recomendadas do ESLint
    ...js.configs.recommended,
  },

  // Adiciona as regras recomendadas específicas para TypeScript
  ...tseslint.configs.recommended,

  // Sobrescreve regras e adiciona novas, se necessário.
  {
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Adiciona a configuração do Prettier. Lembre-se de instalar os pacotes:
  // `npm install -D prettier eslint-plugin-prettier eslint-config-prettier`
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
];
