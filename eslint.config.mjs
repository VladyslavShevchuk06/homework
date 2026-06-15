import next from 'eslint-config-next'

/** @type {import('eslint').Linter.Config[]} */
const config = [
  // skill template files use <placeholder> syntax and are not valid TS
  { ignores: ['.next/**', 'node_modules/**', '.claude/**'] },
  ...next,
]

export default config
