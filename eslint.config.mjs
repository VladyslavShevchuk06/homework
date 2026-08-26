import next from 'eslint-config-next'

/** @type {import('eslint').Linter.Config[]} */
const config = [
  // skill template files use <placeholder> syntax and are not valid TS
  {
    ignores: [
      '.next/**',
      '.next-e2e/**',
      'node_modules/**',
      '.claude/**',
      'playwright-report/**',
      'test-results/**',
      '.playwright-mcp/**',
      'tests/e2e/.auth/**',
    ],
  },
  ...next,
]

export default config
