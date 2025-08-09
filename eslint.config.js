import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import vitest from 'eslint-plugin-vitest'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignorar carpeta de build
  globalIgnores(['dist']),

  // 🔹 Archivos que corren en Node (aquí vive process)
  {
    files: ['vite.config.*', 'eslint.config.*', 'postcss.config.*', 'tailwind.config.*'],
    languageOptions: { globals: { ...globals.node } },
  },

  // 🔹 Código del frontend (navegador)
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['dist/**'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
      globals: { ...globals.browser },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },

  // 🔹 Tests (describe/test/expect/vi como globals)
  {
    files: ['**/__tests__/**/*.{js,jsx}', '**/*.{test,spec}.{js,jsx}'],
    plugins: { vitest },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...vitest.environments.env.globals,
      },
    },
  },
])
