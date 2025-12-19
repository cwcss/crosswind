const config = {
  verbose: false,

  ignores: [
    'node_modules/**',
    'dist/**',
    'fixtures/**',
    'docs/**',
    'packages/*/docs/**',
    '*.min.js',
  ] as const,

  lint: {
    ext: ['.ts', '.js', '.json', '.yaml', '.yml'] as const,
  },

  format: {
    indent: 2,
    quotes: 'single',
    trailingComma: true,
    semicolons: false,
  },

  rules: {
    noConsole: 'off', // CLI tool uses console
  },

  pluginRules: {
    'ts/no-top-level-await': 'off',
    'regexp/no-unused-capturing-group': 'off',
    'regexp/no-super-linear-backtracking': 'off',
    'style/max-statements-per-line': 'off',
    'style/brace-style': 'off',
    'style/quotes': 'off',
    'quotes': 'off',
  },
}

export default config
