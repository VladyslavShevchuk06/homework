import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig } from 'vitest/config'

// config
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: [...configDefaults.exclude, 'tests/e2e/**'],
  },
})
